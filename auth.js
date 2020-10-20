$(function () {

    // ================================================================== Get Data =================================================================

    // ************************ Extract From Cloud ****************************************************

    db.collection("recipes").get().then((querySnapshot) => {
        seperator(querySnapshot);
    });

    // ************************ Seperate Them **********************************************************

    const seperator = (data) => {
        let myRecipes = [];
        let recipeID = [];
        data.forEach((doc) => {
            myRecipes.push(doc.data());
            recipeID.push(doc.id);
        });


        console.log(recipeID);

        let seperatedRecipes = myRecipes.map(recipe => {
            return recipe;
        });

        seperatedRecipes.forEach((item, index) => {
            displayRecipe(item, recipeID[index]);
        });
    }

    // ***************************** Display Seperately ****************************************************
    const displayRecipe = (data, dataID) => {
        var $recipeRow = $('#recipesRow');

        var $recipeDiv = $('<div>');

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

        var $mainDiv = $('<div>', {
            css: {
                width: '18rem'
            }
        });
        $mainDiv.addClass('card mt-3');

        var $image = $('<img>');
        $image.attr('src', description.recipeImgAddr);
        $image.addClass('card-img-top');

        var $innerDiv = $('<div>');
        $innerDiv.addClass('card-body');

        var $rName = $('<h4>');
        $rName.addClass('card-title');
        $rName.text(description.recipeName);

        var $rAuthor = $('<p>');
        $rAuthor.addClass('card-text');
        $rAuthor.html('<small>EmmyM_ighty</small>');

        var $rLink = $('<a>');
        $rLink.addClass('btn btn-danger');
        $rLink.text('View Recipe');
        $rLink.attr('id', dataID);

        $mainDiv.append($image);
        $innerDiv.append($rName);
        $innerDiv.append($rAuthor);
        $innerDiv.append($rLink);

        $mainDiv.append($innerDiv);


        $recipeDiv.append($mainDiv);

        $recipeRow.append($recipeDiv);


        var $thatButton = $('#'+dataID);
        $thatButton.on('click', () => {
            showSingle(data, dataID);
        });
        
        
    }

    // ================================================================= Show Single Recipe =================================================== 
    const showSingle = (data, id) => {
        console.log(id);
    }

    // ================================================================== Listen for Auth Status change ========================================
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