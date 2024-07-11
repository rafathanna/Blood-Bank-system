document.addEventListener("DOMContentLoaded", function () {
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const chatbot = document.querySelector(".chatbot");
  const closeBtn = document.querySelector(".close-btn");
  const sendBtn = document.getElementById("sendBtn");
  const textarea = document.querySelector(".chat-input textarea");
  const chatbox = document.querySelector(".chatbox");
  const micBtn = document.getElementById("micBtn");
  const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

  recognition.lang = "en-US"; // Set language to English
  recognition.interimResults = true; // Enable interim results

  let isRecording = false;

  chatbotToggler.addEventListener("click", function () {
    if (!document.body.classList.contains("show-chatbot")) {
      document.body.classList.add("show-chatbot");

      const bloodTypeQuestion = document.createElement("li");
      bloodTypeQuestion.classList.add("chat", "incoming");
      bloodTypeQuestion.innerHTML = `
        <span class="material-symbols-outlined">smart_toy</span>
        <p class="animate_animated animate_fadeInUp">Your Blood Type Please 🧐</p>
      `;
      chatbox.appendChild(bloodTypeQuestion);
    }
  });

  closeBtn.addEventListener("click", function () {
    document.body.classList.remove("show-chatbot");
    if (isRecording) {
      recognition.stop();
      isRecording = false;
    }
  });

  sendBtn.addEventListener("click", function () {
    sendMessage(textarea.value.trim());
  });

  micBtn.addEventListener("click", function () {
    micBtn.classList.toggle("active");

    if (micBtn.classList.contains("active")) {
      micBtn.textContent = "pause"; 
      recognition.start();
      isRecording = true;
    } else {
      micBtn.textContent = "mic"; 
      recognition.stop();
      isRecording = false;
    }
  });

  recognition.onresult = function (event) {
    const userMessage = event.results[0][0].transcript.trim();
    if (event.results[0].isFinal) {
      sendMessage(userMessage);
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error occurred:", event.error);
    isRecording = false;
  };

  function sendMessage(message) { 
      if (message !== "") {
        const outgoingMessage = document.createElement("li");
        outgoingMessage.classList.add("chat", "outgoing");
        outgoingMessage.innerHTML = `<p style="color: #fff;">${message}</p>`;
        chatbox.appendChild(outgoingMessage);
    
        const loadingIcon = document.createElement("li");
        loadingIcon.classList.add("chat", "loading");
        loadingIcon.innerHTML = `<span class="loader"></span><span class="loader"></span>`;
        chatbox.appendChild(loadingIcon);
    
        navigator.geolocation.getCurrentPosition(function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
    
          fetch("https://ali-ragab-c865e3a7eb37.herokuapp.com/api/searchBloodType", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedBloodType: message, latitude, longitude }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);

              const bloodAmounts = data.BloodAmounts;
              const closestHospital = data.closestHospital;
              const hospitals = data.hospitals;

              const loadingIcon = document.querySelector(".loading");
              if (loadingIcon && chatbox.contains(loadingIcon)) {
                chatbox.removeChild(loadingIcon);

              }

              
              if (hospitals) {
                const hospitalsMessage = document.createElement("li");
                hospitalsMessage.classList.add("chat", "incoming");
                hospitalsMessage.innerHTML = `
                  <span class="material-symbols-outlined">smart_toy</span><br/>
                  <p>Hospitals have blood:  ${hospitals.join(' - ') }</p>
             
                  

                `;
                chatbox.appendChild(hospitalsMessage);
              }


              if (closestHospital) {
                const closestHospitalMessage = document.createElement("li");
                closestHospitalMessage.classList.add("chat", "incoming");
                closestHospitalMessage.innerHTML = `
                  <span class="material-symbols-outlined">smart_toy</span><br/>
                  <p id="closestHospital">closestHospital: ${closestHospital.name} (${closestHospital.distance} km)</p>
                `;
                chatbox.appendChild(closestHospitalMessage);

                closestHospitalMessage.addEventListener("click", function () {
                  const mapContainer = document.createElement("div");
                  mapContainer.classList.add("map-container");
                  mapContainer.innerHTML = `
                    <iframe
                      width="100%"
                      height="400px"
                      frameborder="10"
                      scrolling="yes"
                      marginheight="3"
                      marginwidth="10"
                      src="https://www.google.com/maps?q=${latitude},${longitude}&output=embed"
                    ></iframe>
                  `;
                  chatbox.appendChild(mapContainer);
                });
              }



              if (bloodAmounts) {
                Object.entries(bloodAmounts).forEach(([bloodType, amount]) => {
                  const amountMessage = document.createElement("li");
                  amountMessage.classList.add("chat", "incoming");
                  amountMessage.innerHTML = `
                    <span class="material-symbols-outlined">smart_toy</span><br/>
                    <p>Amount of [${bloodType}] blood : ${amount} ml</p>
                  `;
                  chatbox.appendChild(amountMessage);
                });
              }

            
            })
            .catch((error) => {
              console.error("Error:", error);
              const loadingIcon = document.querySelector(".loading");
              if (loadingIcon && chatbox.contains(loadingIcon)) {
                chatbox.removeChild(loadingIcon);
              }
            });
        });
      }
    }
});
