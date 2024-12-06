# Menggunakan image Node.js versi 18
FROM node:18.17.1

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyimpan port aplikasi sebagai environment variable
ENV PORT=3000
ENV MODEL_URL='https://storage.googleapis.com/cancer-models-storage/model.json'

# Menyalin semua file ke dalam container
COPY . .

# Instalasi dependencies menggunakan npm
RUN npm install

# Mengekspos port 3000 agar aplikasi bisa diakses
EXPOSE 3000

# Menentukan perintah yang akan dijalankan ketika container dimulai
CMD [ "npm", "run", "start" ]
