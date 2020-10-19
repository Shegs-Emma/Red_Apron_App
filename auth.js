$(function () {

    // ========================================= Get Data =============================================

    // ************************ Extract From Cloud ****************************************************

    db.collection("recipes").get().then((querySnapshot) => {
        seperator(querySnapshot);
    });

    // ************************ Seperate Them **********************************************************

    const seperator = (data) => {
        let myRecipes = [];
        data.forEach((doc) => {
            myRecipes.push(doc.data());
            console.log(doc.id);
        });

        let seperatedRecipes = myRecipes.map(recipe => {
            return recipe;
        });

        seperatedRecipes.forEach(item => {
            displayRecipe(item);
        });
    }

    // ***************************** Display Seperately ****************************************************
    const displayRecipe = (data) => {
        var $recipeRow = $('#recipesRow');

        var $recipeDiv = $('<div>');

        let html;

        let ingredients = [];
        let directions = [];
        let description = {};

        for (recipePart in data) {

            if (recipePart === 'recipeIngredients') {
                ingredients = data[recipePart];
            } else if (recipePart === 'recipeDirection') {
                directions = data[recipePart];
            } else if (recipePart === 'recipeDescription') {
                description = data[recipePart];
            }
        };

        html = `<div class="card mt-3" style="width: 18rem;">
                    <img src="${description.recipeImgAddr}"
                        class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title">${description.recipeName}</h4>
                        <p class="card-text"><small>EmmyM_ighty</small></p>
                        <a href="./showRecipe.html" class="btn btn-danger">View Recipe</a>
                    </div>
                </div>`;

        $recipeDiv.append(html);

        $recipeRow.append($recipeDiv);
    }


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