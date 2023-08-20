const MicRecorder = require("mic-recorder-to-mp3");

// New instance
const recorder = new MicRecorder({
  bitRate: 128,
});

export const startRecording = () => {
  // Start recording. Browser will request permission to use your microphone.
  recorder
    .start()
    .then(() => {
      // something else
    })
    .catch((e) => {
      console.error(e);
    });
};

export const stopRecording = () => {
  return new Promise((res) => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, "audio.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });
        const formData = new FormData();
        formData.append("file", file);
        res(formData);
      })
      .catch((e) => {
        alert("We could not retrieve your message");
      });
  });
};
