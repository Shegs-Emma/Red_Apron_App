$(function () {
    // ============================== Listen for Auth Status change ==================================
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log('User logged in:', user);
        } else {
            console.log('user logged out!');
        }
    });

    // ======================================= Sign up ===================================
    const $signUp = $('#signup-form');

    $signUp.on('submit', (e) => {
        e.preventDefault();

        // Get User Information
        const $userName = $('#uname').val();
        const $email = $('#email').val();
        const $password = $('#pword').val();

        // Sign up the User
        auth.createUserWithEmailAndPassword($email, $password).then((cred) => {
            $('#uname').val('');
            $('#email').val('');
            $('#pword').val('');
            window.location.href = "../recipe/recipes.html";
        }).catch((error) => {
            console.log(error);
        });
    });


    // ======================================= Logout ========================================
    const $logout = $('#logout');
    $logout.on('click', (e) => {
        e.preventDefault();
        auth.signOut().then(() => {
            window.location.href = "../index.html";
        });
    });


    // ======================================== Log In ========================================
    const $logIn = $('#login-form');
    $logIn.on('submit', (e) => {
        e.preventDefault();

        // Get User Information
        const $loginemail = $('#loginEmail').val();
        const $loginpassword = $('#loginPass').val();

        auth.signInWithEmailAndPassword($loginemail, $loginpassword).then((cred) => {
            $('#loginEmail').val('');
            $('#loginPass').val('');
            window.location.href = "../recipe/recipes.html";
        })
    })

});