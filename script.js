$(function () {
    // ================================================= My Global ======================================================
    let recipeDesc;
    let recipeIngr;
    let recipeDirec;

    $('#addIngr').attr('disabled', true);
    $('#addDirect').attr('disabled', true);
    $('#submit-recipe').attr('disabled', true);

    // ================================================================= Recipe Class Declaration =========================================
    class Recipe {
        constructor(recipeDescription, recipeIngredients, recipeDirection) {
            this.recipeDescription = recipeDescription;
            this.recipeIngredients = recipeIngredients;
            this.recipeDirection = recipeDirection;
        }
    };
    //This code will generate the random numbers for the id needed for deletion
    var GenRandom = {

        Stored: [],

        Job: function () {
            var newId = Date.now().toString().substr(6); // or use any method that you want to achieve this string

            if (this.Check(newId)) {
                this.Job();
            }

            this.Stored.push(newId);
            return newId; // or store it in sql database or whatever you want

        },

        Check: function (id) {
            for (var i = 0; i < this.Stored.length; i++) {
                if (this.Stored[i] == id) return true;
            }
            return false;
        }

    };



    // =================================================================== UI Class Declaration ============================================
    class UI {
        static addRecipe(item) {
            const $section = $('#right-section');
            $section.empty();
            $section.append(item);

        };

        static fillRecipe(recipeItem, item) {
            if (item === 'desc') {
                recipeDesc = recipeItem;
            } else if (item === 'ingr') {
                recipeIngr = recipeItem;
            } else if (item === 'dire') {
                recipeDirec = recipeItem;
            }
        }

        static createRecipe(recipeDes, recipeIng, recipeDir) {
            // let newRecipe = new Recipe(recipeDes, recipeIng, recipeDir);
            auth.onAuthStateChanged(user => {
                let recipeAuthor;
                if (user) {
                    db.collection('users').doc(user.uid).get().then(doc => {
                        recipeAuthor = doc.data().userName;
                    }).then(() => {
                        db.collection("recipes").doc(GenRandom.Job()).set({
                            recipeDescription: {
                                cookTime: recipeDes.cookTime,
                                prepTime: recipeDes.prepTime,
                                recipeDesc: recipeDes.recipeDes,
                                recipeImgAddr: recipeDes.recipeImgAddr,
                                recipeName: recipeDes.recipeName,
                                serve: recipeDes.serve
                            },
                            recipeDirection: recipeDir.map(dir => dir),
                            recipeIngredients: recipeIng.map(recipe => recipe),
                            author: recipeAuthor
                        }).then(function () {
                            console.log("Document successfully written!");
                            showAlert("Recipe Submitted Succesfully!", "success", $('#recipes-section'));

                            setTimeout(function(){
                                window.location.href = "./recipes.html";
                            }, 4000)
                        }).catch(function (error) {
                            console.error("Error writing document: ", error);
                            showAlert("Error Submitting Recipe!", "danger", $('#recipes-section'));
                        });
                    })
                }
            });
        }
    };

    // ==================================================================== Add Recipe Event Handlers ======================================
    const $addDescription = $('#addDesc');
    $addDescription.on('click', (e) => {
        e.preventDefault();
        let descHtml = `<form class="row" id="saveDescription">
            <div class="form-group col-12">
                <label for="recipeName">Recipe Name</label>
                <input type="text" class="form-control" id="recipeName" required />
            </div>
            <div class="form-group col-12">
                <label for="recipeImage">Recipe Image Address</label>
                <input type="text" class="form-control" id="recipeImage" required />
            </div>
            <div class="form-group col-12">
                <label class="form-check-label" for="recipeDesc">Recipe Description</label>
                <textarea id="recipeDesc" class="form-control" required></textarea>
            </div>
            <div class="form-group col-md-4 col-12">
                <label for="prepTime">Minutes To Prepare</label>
                <input type="number" class="form-control" id="prepTime" required />
            </div>
            <div class="form-group col-md-4 col-12">
                <label for="cookTime">Minutes To Cook</label>
                <input type="number" class="form-control" id="cookTime" required />
            </div>
            <div class="form-group col-md-4 col-12">
                <label for="serve">Number of Servings</label>
                <input type="number" class="form-control" id="serve" required />
            </div>
            <button type="submit" class="btn btn-primary mr-auto ml-auto" >Save</button>
        </form>`;

        UI.addRecipe(descHtml);

        // ================================================== Save recipe Description things ==============================================
        const $savedDesc = $('#saveDescription');
        $savedDesc.on('submit', (e) => {
            e.preventDefault();

            const $recipeName = $('#recipeName').val();
            const $recipeImageAddress = $('#recipeImage').val();
            const $recipeDescription = $('#recipeDesc').val();
            const $prepTime = $('#prepTime').val();
            const $cookTime = $('#cookTime').val();
            const $servings = $('#serve').val();

            let recipeDescr = {
                recipeName: $recipeName,
                recipeImgAddr: $recipeImageAddress,
                recipeDes: $recipeDescription,
                prepTime: $prepTime,
                cookTime: $cookTime,
                serve: $servings
            };

            UI.fillRecipe(recipeDescr, 'desc');

            $('#recipeName').val('');
            $('#recipeImage').val('');
            $('#recipeDesc').val('');
            $('#prepTime').val('');
            $('#cookTime').val('');
            $('#serve').val('');

            $('#addDesc').attr('disabled', true);

            const $section = $('#right-section');
            $section.empty();
            showAlert("Recipe Description Saved!", "success", $('#recipes-section'));

            $('#addIngr').attr('disabled', false);
        });
    });

    const $addIngredients = $('#addIngr');
    $addIngredients.on('click', (e) => {
        e.preventDefault();
        let ingreHtml = `<form class="row" id="saveIngredients">
            <label class="ml-4">Please Input The Recipe Ingredients, One per Input box.....</label>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" required />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" required />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" required />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" required />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            <div class="form-group col-12">
                <input type="text" class="form-control ingredientsBox" />
            </div>
            
            <button type="submit" class="btn btn-info mr-auto ml-auto">Save</button>
        </form>`;

        UI.addRecipe(ingreHtml);

        const $savedIngr = $('#saveIngredients');
        $savedIngr.on('submit', (e) => {
            e.preventDefault();

            const $recipeIng = $('.ingredientsBox');

            let recipeIng = [];
            $recipeIng.each(function (i, ing) {
                if ($(ing).val() !== "") {
                    recipeIng.push($(ing).val());
                }
            });

            UI.fillRecipe(recipeIng, 'ingr');

            $recipeIng.each(function (i, ing) {
                $(ing).val('');
            });

            $('#addDesc').attr('disabled', true);
            $('#addIngr').attr('disabled', true);

            const $section = $('#right-section');
            $section.empty();
            showAlert("Recipe Ingredients Saved!", "success", $('#recipes-section'));

            $('#addDirect').attr('disabled', false);
        });
    });

    const $addDirection = $('#addDirect');
    $addDirection.on('click', (e) => {
        e.preventDefault();
        let directHtml = `<form class="row" id="saveDirection">
            <label class="ml-4">Please fill the direction to prepare in the three (3) boxes....</label>
            <div class="form-group col-12">
                <textarea class="form-control directionBox" required></textarea>
            </div>
            <div class="form-group col-12">
                <textarea class="form-control directionBox"></textarea>
            </div>
            <div class="form-group col-12">
                <textarea class="form-control directionBox"></textarea>
            </div>
            
            <button type="submit" class="btn btn-info mr-auto ml-auto" >Save</button>
        </form>`;

        UI.addRecipe(directHtml);

        const $savedDirect = $('#saveDirection');
        $savedDirect.on('submit', (e) => {
            e.preventDefault();

            const $recipeDire = $('.directionBox');

            let recipeDirection = [];
            $recipeDire.each(function (i, dir) {
                if ($(dir).val() !== "") {
                    recipeDirection.push($(dir).val());
                }
            });

            UI.fillRecipe(recipeDirection, 'dire');

            $recipeDire.each(function (i, dir) {
                $(dir).val('');
            });

            $('#addDesc').attr('disabled', true);
            $('#addIngr').attr('disabled', true);
            $('#addDirect').attr('disabled', true);

            const $section = $('#right-section');
            $section.empty();
            showAlert("Recipe Direction Saved!", "success", $('#recipes-section'));

            $('#submit-recipe').attr('disabled', false);
        });
    });

    // ========================================================== Submit Recipe ============================================
    const $submitRecipe = $('#submit-recipe');
    $submitRecipe.on('click', (e) => {
        e.preventDefault();

        if (recipeDesc && recipeIngr && recipeDirec) {
            UI.createRecipe(recipeDesc, recipeIngr, recipeDirec);
            $('#submit-recipe').attr('disabled', true);
        }
    });




    // =========================================================== All About Showing Alerts =====================================
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