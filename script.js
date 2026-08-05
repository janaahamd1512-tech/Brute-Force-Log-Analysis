function analyzeLogs() {

    const file = document.getElementById("fileInput").files[0];

    if (!file) {

        alert("Please select auth.log");

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        const text = e.target.result;

        const lines = text.split("\n");

        let failed = {};

        // تحليل السجل
        lines.forEach(line => {

            if (line.includes("Failed password")) {

                const match = line.match(/from (\d+\.\d+\.\d+\.\d+)/);

                if (match) {

                    const ip = match[1];

                    failed[ip] = (failed[ip] || 0) + 1;

                }

            }

        });

        let report = "=========== SECURITY REPORT ===========\n\n";

        let maxAttempts = 0;

        for (let ip in failed) {

            report += "IP Address : " + ip + "\n";

            report += "Failed Attempts : " + failed[ip] + "\n";

            if (failed[ip] >= 5) {

                report += "Status : 🚨 Brute Force Attack Detected\n";

            } else {

                report += "Status : ✅ Normal Activity\n";

            }

            report += "\n---------------------------------\n\n";

            if (failed[ip] > maxAttempts) {

                maxAttempts = failed[ip];

            }

        }

        document.getElementById("result").innerText = report;

        const bar = document.getElementById("riskBar");

        const textRisk = document.getElementById("riskText");

        if (maxAttempts >= 5) {

            bar.style.width = "100%";

            bar.style.background = "#ff4d4d";

            textRisk.innerHTML = "🔴 HIGH RISK";

        }

        else if (maxAttempts >= 3) {

            bar.style.width = "70%";

            bar.style.background = "#FFD43B";

            textRisk.innerHTML = "🟡 MEDIUM RISK";

        }

        else if (maxAttempts > 0) {

            bar.style.width = "35%";

            bar.style.background = "#00E676";

            textRisk.innerHTML = "🟢 LOW RISK";

        }

        else {

            bar.style.width = "0%";

            textRisk.innerHTML = "No Risk";

        }

    };

    reader.readAsText(file);

}