window.addEventListener("load", () => {

    function sendData(formProps) {   
        const username = formProps.username;
        const password = formProps.password;
        (async () => {
            const response = await fetch('https://enrichment-socs.apps.binus.ac.id/lp-api/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })
        
            const data = await response.json()
            console.log(data);
            if(data.status != 200 && data.message.username){
                document.querySelector(".error-username").innerHTML = data.message.username;
            }

            if(data.status != 200 && data.message.password){
                document.querySelector(".error-password").innerHTML = data.message.password;
            }

            if(data.status != 200 && !data.message.username && !data.message.password){
                document.querySelector(".error-password").innerHTML = data.message;
            }
            
            if(data.status == 200){
                localStorage.setItem("loginData", JSON.stringify(data));
                window.location.href = "log-book.html";
            }
        })();
    }   

    const form = document.getElementById("myForm");
    if(form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const FD = new FormData(form);
            const formProps = Object.fromEntries(FD);
            sendData(formProps);
        });
    }

    // Log Book
    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const logoutButton = document.querySelector(".logout-button");
    if(logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loginData");
            window.location.href = "index.html";
        });
    }

    if(!loginData && window.location.href == "https://injoker24.github.io/Learning-Plan-Bypass/log-book.html") {
        window.location.href = "index.html";
    }

    var token;
    var lpData;
    var lbData;
    if(loginData) {
        token = "Bearer " + loginData.data.token;
        
        (async () => {
            const response = await fetch('https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/lp', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': token
                },
            })
        
            const data = await response.json()
            lpData = data;
            if(data.status == 200){
                document.querySelector(".title-name").innerHTML = "Hi, " + lpData.data.learningPlan.student_name;
            }
        })();

        (async () => {
            const response = await fetch('https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': token
                },
            })
        
            const data = await response.json()
            lbData = data;
            console.log(lbData);
            if(data.status == 200){
                
            }
        })();

        function editLogBook(formProps) {   
            const date = new Date(formProps.logbookdate);
            const month = date.getMonth() + 1;
            const logbookdate = formProps.logbookdate;
            const clockin = formProps.clockin;
            const clockout = formProps.clockout;
            const activity = formProps.activity;
            const description = formProps.description;
            (async () => {
                const response = await fetch('', {
                    method: 'POST',
                    body: JSON.stringify({
                        clock_in: clockin,
                        clock_out: clockout,
                        activity: activity,
                        description: description
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': token
                    },
                })
            
                const data = await response.json()
                console.log(data);
            })();
        }   

        const lbform = document.getElementById("logbookForm");
        if(lbform) {
            lbform.addEventListener("submit", (event) => {
                event.preventDefault();
                const FD = new FormData(lbform);
                const formProps = Object.fromEntries(FD);
                editLogBook(formProps);
            });
        }
    }
});
