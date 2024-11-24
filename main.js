$(document).ready(function () {
    var flame = $("#flame");
    var txt = $("h1");

    // Function to blow out the candle
    function blowOutCandle() {
        flame.removeClass("burn").addClass("puff");
        $(".smoke").each(function () {
            $(this).addClass("puff-bubble");
        });
        $("#glow").remove();
        txt.hide().html("Wish you a happy birthday Maria").delay(750).fadeIn(300);
        $("#candle").animate(
            {
                opacity: ".5",
            },
            100
        );
    }

    // Set up Web Audio API for microphone input
    navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 1024;

            microphone.connect(analyser);

            // Check microphone input volume
            function detectBlow() {
                analyser.getByteFrequencyData(dataArray);

                // Get average volume
                const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

                // If volume exceeds threshold, blow out the candle
                if (volume > 60) {
                    blowOutCandle();
                }

                requestAnimationFrame(detectBlow);
            }

            detectBlow(); // Start detecting sound
        })
        .catch(function (err) {
            console.error("Microphone access denied:", err);
            alert("Please allow microphone access to blow out the candle!");
        });
});
