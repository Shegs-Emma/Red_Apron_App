$(function () {
    // ================================================================== Listen for Auth Status change ========================================
    var $welcomeMessage = $('.welcomeMessage');

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('users').doc(user.uid).get().then( doc => {
                $welcomeMessage.text(`Logged in as ${doc.data().userName}`);
            });
            // ************************ Extract From Cloud ****************************************************
            db.collection("recipes").onSnapshot( snapshot => {
                seperator(snapshot);
                showSingle(snapshot);
            }, err => {
                console.log(err.message);
            });
        } else {
            $welcomeMessage.text('');

            seperator([]);
            showSingle([]);
        }
    });

    // ************************ Seperate Them **********************************************************

    const seperator = (data) => {
        if (data.length !== 0) {
            let myRecipes = [];
            let recipeID = [];
            data.forEach((doc) => {
                myRecipes.push(doc.data());
                recipeID.push(doc.id);
            });

            let seperatedRecipes = myRecipes.map(recipe => {
                return recipe;
            });

            seperatedRecipes.forEach((item, index) => {
                displayRecipe(item, recipeID[index]);
            });
        } else {
            
        }
    }

    // ***************************** Display Seperately ****************************************************
    const displayRecipe = (data, dataID) => {
        var $recipeRow = $('#recipesRow');

        var $recipeDiv = $('<div>');

        let ingredients = [];
        let directions = [];
        let description = {};
        let author = [];

        for (recipePart in data) {

            if (recipePart === 'recipeIngredients') {
                ingredients = data[recipePart];
            } else if (recipePart === 'recipeDirection') {
                directions = data[recipePart];
            } else if (recipePart === 'recipeDescription') {
                description = data[recipePart];
            } else if (recipePart === 'author') {
                author = data[recipePart];
            }
        };

        var $mainDiv = $('<div>', {
            css: {
                width: '18rem'
            }
        });
        $mainDiv.addClass('card mt-3');

        var $image = $('<img>', {
            css: {
                height: '250px'
            }
        });
        $image.attr('src', description.recipeImgAddr);
        $image.addClass('card-img-top');

        var $innerDiv = $('<div>');
        $innerDiv.addClass('card-body');

        var $rName = $('<h4>');
        $rName.addClass('card-title');
        $rName.text(description.recipeName);

        var $rAuthor = $('<p>');
        $rAuthor.addClass('card-text');
        $rAuthor.html(`<small>Created By: ${author}</small>`);

        var $rLink = $('<a>');
        $rLink.addClass('btn btn-danger');
        $rLink.text('View Recipe');
        $rLink.attr('id', dataID);
        $rLink.attr('href', './showRecipe.html');

        $mainDiv.append($image);
        $innerDiv.append($rName);
        $innerDiv.append($rAuthor);
        $innerDiv.append($rLink);

        $mainDiv.append($innerDiv);


        $recipeDiv.append($mainDiv);

        $recipeRow.append($recipeDiv);


        var $thatButton = $('#' + dataID);
        $thatButton.on('click', () => {
            var myInfo = {
                data,
                dataID
            };
            localStorage.setItem('recipe', JSON.stringify(myInfo));
        });
    }

    // ================================================================= Show Single Recipe =================================================== 
    const showSingle = (data) => {
        if (data.length !== 0) {
            var chosen = JSON.parse(localStorage.getItem('recipe'));
            let recipeId = [];
            data.forEach((doc) => {
                recipeId.push(doc.id);
            });

            var recipeID = recipeId.filter(id => {
                return id === chosen.dataID
            });

            if (recipeID) {
                db.collection("recipes").doc(recipeID.join()).get().then((querySnapshot) => {
                    var myRecipe = querySnapshot.data();
                    let myRecipeDesc = myRecipe.recipeDescription;
                    let myRecipeIng = myRecipe.recipeIngredients;
                    let myRecipeDir = myRecipe.recipeDirection;

                    creator(myRecipeDesc, myRecipeIng, myRecipeDir);
                });
            }
        }

    }

    // ============================================= Construct the Recipe ======================================================
    const creator = (des, ing, dir) => {

        let $recHeader = `
            <span id="recipeSpan">
                <h2>${des.recipeName}</h2>
            </span>
        `;

        let $recImg = `
            <img src=${des.recipeImgAddr} class="card-img-top" alt="recipeIMG">
        `;

        let $recDes = `${des.recipeDesc}`;

        let $recTime = `${des.cookTime} mins to prepare and ${des.prepTime} mins to cook`;
        let $recServe = `Serves ${des.serve}`;
        let $recIngr = `${ing.map(ingI => '<p class="mt-0 mb-0 ml-5">' + ingI + '</p>')}`;
        let $recDir = `${dir.map(dirI => '<p class="mt-0 mb-0 ml-5">' + dirI + '</p>')}`;

        $('#recipes-header').html($recHeader);
        $('#imageSpace').html($recImg);
        $('#ds').text($recDes);
        $('#time').text($recTime);
        $('#serve').text($recServe);
        $('#ourIng').html($recIngr);
        $('#ourDir').html($recDir);
    };

    // ======================================= Sign up ===================================
    const $signUp = $('#signup-form');

    $signUp.on('submit', (e) => {
        e.preventDefault();

        // Get User Information
        const $userName = $('#uname').val();
        const $email = $('#email').val();
        const $password = $('#pword').val();

        // Sign up the User
        auth.createUserWithEmailAndPassword($email, $password).then( cred => {
            return db.collection("users").doc(cred.user.uid).set({
                userName: $userName
            })     
        }).then(() => {
            $('#uname').val('');
            $('#email').val('');
            $('#pword').val('');
            window.location.href = "../recipe/recipes.html";
        }).catch((error) => {
            showAlert(error.message, 'danger', $('#signup-form'));
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
        }).catch( err => {
            showAlert(err.message, 'danger', $('#login-form'));
        });
    });

    // The show alert function
    function showAlert(message, className, location){
        let $alertDiv = $('<div>');
        $alertDiv.addClass('alert alert-'+className);
        $alertDiv.append(document.createTextNode(message));

        let $add = location;

        $add.prepend($alertDiv);

        // Disappear in 2 seconds
        setTimeout(() => $('.alert').remove(), 3000);
    };
});