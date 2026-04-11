const cloudName = "da2jukpvs";
const uploadPreset = "wedding_upload";

async function upload() 
{
  const files = document.getElementById("fileInput").files;
  const status = document.getElementById("status");
  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");

  if (files.length === 0) {
    status.innerText = "Ве молиме изберете датотеки 📷";
    return;
  }

  status.innerText = "Се прикачува... ⏳";
  progressContainer.style.display = "block";

  let totalFiles = files.length;
  let uploadedFiles = 0;

  const name = document.getElementById("nameInput").value;
  const message = document.getElementById("messageInput").value;

  for (let file of files) {

    if (file.size > 100 * 1024 * 1024) {
      alert("File too large (max 100MB)");
      continue;
    }

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("context", `name=${name}|message=${message}`);

      xhr.open("POST", url);

      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          let percent = Math.round((e.loaded / e.total) * 100);
          progressBar.style.width = percent + "%";
          progressBar.innerText = percent + "%";
        }
      };

      xhr.onload = function () {
        uploadedFiles++;

        // Reset per file
        progressBar.style.width = "0%";
        progressBar.innerText = "0%";

        resolve();
      };

      xhr.onerror = function () {
        reject();
      };

      xhr.send(formData);
    });
  }

  status.innerText = "Ви благодариме! Спомените се успешно зачувани ❤️";
  progressContainer.style.opacity = "0";

  setTimeout(() => {
    progressContainer.style.display = "none";
    progressContainer.style.opacity = "1";

    progressBar.style.width = "0%";
    progressBar.innerText = "0%";

    document.getElementById("fileInput").value = "";
    document.getElementById("fileCount").innerText = "Нема избрани датотеки";
    document.getElementById("nameInput").value = "";
    document.getElementById("messageInput").value = "";
  }, 500);
}

function updateFileCount() 
{
  const files = document.getElementById("fileInput").files;
  const fileCount = document.getElementById("fileCount");

  if (files.length === 0) {
    fileCount.innerText = "Нема избрани датотеки";
  } else {
    fileCount.innerText = files.length + " избрани датотеки";
  }
}