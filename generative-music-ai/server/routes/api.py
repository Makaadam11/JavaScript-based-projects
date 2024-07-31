from flask import Flask, request, jsonify, Blueprint, send_from_directory
from flask_cors import CORS, cross_origin
import base64
import numpy as np
from google.cloud import storage
from werkzeug.utils import secure_filename
from models.mistralai import MistralAI
from models.deepface import DeepFaceModel
from models.speech2text import Speech2Text2Transcriber
from models.musicgen import MusicGen
from uuid import uuid4
import cv2
from pydub import AudioSegment
import os
import io

api = Blueprint('api', __name__)
CORS(api, origins=["http://localhost:3000"], supports_credentials=True)

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'C:\\5.ComputionalEnt\\generative-music-ai\\server\\secrets\\musicgen.json'

BUCKET_NAME = 'musicgen-songs'

@api.route('/generate_text', methods=['POST'])
@cross_origin()
def generate_text():
    text = request.json.get('text')
    print("generate_text server: ", text)
    mistralai_model = MistralAI()
    response = mistralai_model.generate_text(text)
    return jsonify({"response": response}), 200

@api.route('/analyze_face', methods=['POST'])
@cross_origin()
def analyze_face():
    data = request.get_json()
    base64_image = data['image'].split(',')[1]
    decoded_image = base64.b64decode(base64_image)
    nparr = np.frombuffer(decoded_image, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    model = DeepFaceModel()
    response = model.process_frame(frame)

    return jsonify({"response": response}), 200

@api.route('/transcribe_speech', methods=['POST'])
@cross_origin()
def transcribe_speech():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file in request"}), 400
    audio_file = request.files['audio']
    try:
        audio = AudioSegment.from_file(audio_file, format="webm")
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav", parameters=["-ac", "1", "-ar", "16000"])  # Mono channel, 16000Hz
        wav_io.seek(0)  # Important to rewind to the start of the BytesIO object

        s2t2_model = Speech2Text2Transcriber()
        transcription = s2t2_model.generate_transcription(wav_io)

        if transcription is None or "error" in transcription:
            error_message = transcription.get("error", "Unknown error")
            print("Error transcription: ", error_message)
            return jsonify({"error": error_message}), 500

        return jsonify({"transcription": transcription}), 200
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@api.route('/generate_with_description', methods=['POST'])
@cross_origin()
def generate_with_description():
    description = request.json.get('description')
    music_gen = MusicGen()
    song_url = music_gen.generate_music(description)
    print("song_url: ", song_url)
    return jsonify({"songUrl": song_url}), 200


def upload_to_gcs(file, filename):
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file)
    blob.make_public()
    return blob.public_url, blob.name

def delete_from_gcs(blob_name):
    client = storage.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(blob_name)
    blob.delete()

@api.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Generate a unique filename using UUID
    unique_id = uuid4()
    original_filename = secure_filename(file.filename)
    filename, file_extension = original_filename.rsplit('.', 1) if '.' in original_filename else (original_filename, '')
    unique_filename = f"{filename}_{unique_id}.{file_extension}" if file_extension else f"{filename}_{unique_id}"

    file_url, blob_name = upload_to_gcs(file, unique_filename)
    return jsonify({"file_url": file_url, "blob_name": blob_name}), 200

@api.route('/generate_with_audio', methods=['POST'])
def generate_from_audio():
    data = request.get_json()
    if not data or 'audioLink' not in data or 'blobName' not in data:
        return jsonify({"error": "No audio link or blob name provided"}), 400

    audio_link = data['audioLink']
    blob_name = data['blobName']
    print("audio_link: ", audio_link)
    try:
        music_gen = MusicGen()
        generated_music_url = music_gen.generate_music("melodic song", audio_link)
        delete_from_gcs(blob_name)
        return jsonify({"songUrl": generated_music_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/generate_with_multi', methods=['POST'])
@cross_origin()
def generate_with_multi():
    description = request.form.get('description')
    audio_link = request.form.get('audioLink')
    blob_name = request.form.get('blobName')
    if not description or not audio_link or not blob_name:
        return jsonify({"error": "No description or audio link provided"}), 400

    print("audio_link: ", audio_link)
    try:
        music_gen = MusicGen()
        generated_music_url = music_gen.generate_music(description, audio_link)
        delete_from_gcs(blob_name)
        return jsonify({"songUrl": generated_music_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
