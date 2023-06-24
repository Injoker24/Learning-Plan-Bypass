window.addEventListener("load", () => {

    function sendData(formProps) {   
        const username = formProps.username;
        const password = formProps.password;
        document.querySelector(".error-username").innerHTML = "";
        document.querySelector(".error-password").innerHTML = "";
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
            document.querySelector(".error-date").innerHTML = "";
            document.querySelector(".error-activity").innerHTML = "";
            document.querySelector(".error-clockin").innerHTML = "";
            document.querySelector(".error-clockout").innerHTML = "";
            document.querySelector(".error-description").innerHTML = "";
            document.querySelector(".success-edit").innerHTML = "";
            var found = false;
            lbData.data.logbookMonth.map((data) => {
                if(month == data.month) {
                    data.log_book_month_details.map((data2) => {
                        if(data2.date_filled == logbookdate) {
                            found = true;
                            (async () => {
                                const response = await fetch('https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book/' + data2.uid + '/edit', {
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

                                if(data.status != 204 && data.message.activity){
                                    document.querySelector(".error-activity").innerHTML = data.message.activity;
                                }
                    
                                if(data.status != 204 && data.message.clock_in){
                                    document.querySelector(".error-clockin").innerHTML = data.message.clock_in;
                                }
                    
                                if(data.status != 204 && data.message.clock_out){
                                    document.querySelector(".error-clockout").innerHTML = data.message.clock_out;
                                }

                                if(data.status != 204 && data.message.description){
                                    document.querySelector(".error-description").innerHTML = data.message.description;
                                }
                                
                                if(data.status == 204){
                                    document.querySelector(".success-edit").innerHTML = "Berhasil mengedit logbook";
                                }
                            })();
                        }
                    });
                }
            });

            if(found == false) {
                document.querySelector(".error-date").innerHTML = "Date not found";
            }
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

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
  }
