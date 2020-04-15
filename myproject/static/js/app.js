document.addEventListener("DOMContentLoaded", function () {
    /**
     * HomePage - Help section
     */
    class Help {
        constructor($el) {
            this.$el = $el;
            this.$buttonsContainer = $el.querySelector(".help--buttons");
            this.$slidesContainers = $el.querySelectorAll(".help--slides");
            this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
            this.init();
        }

        init() {
            this.events();
        }

        events() {
            /**
             * Slide buttons
             */
            this.$buttonsContainer.addEventListener("click", e => {
                if (e.target.classList.contains("btn")) {
                    this.changeSlide(e);
                }
            });

            /**
             * Pagination buttons
             */
            this.$el.addEventListener("click", e => {
                if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
                    this.changePage(e);
                }
            });
        }

        changeSlide(e) {
            e.preventDefault();
            const $btn = e.target;

            // Buttons Active class change
            [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
            $btn.classList.add("active");

            // Current slide
            this.currentSlide = $btn.parentElement.dataset.id;

            // Slides active class change
            this.$slidesContainers.forEach(el => {
                el.classList.remove("active");

                if (el.dataset.id === this.currentSlide) {
                    el.classList.add("active");
                }
            });
        }

        /**
         * TODO: callback to page change event
         */
        changePage(e) {
            e.preventDefault();
            const page = e.target.dataset.page;

            console.log(page);
        }
    }

    const helpSection = document.querySelector(".help");
    if (helpSection !== null) {
        new Help(helpSection);
    }

    /**
     * Form Select
     */
    class FormSelect {
        constructor($el) {
            this.$el = $el;
            this.options = [...$el.children];
            this.init();
        }

        init() {
            this.createElements();
            this.addEvents();
            this.$el.parentElement.removeChild(this.$el);
        }

        createElements() {
            // Input for value
            this.valueInput = document.createElement("input");
            this.valueInput.type = "text";
            this.valueInput.name = this.$el.name;

            // Dropdown container
            this.dropdown = document.createElement("div");
            this.dropdown.classList.add("dropdown");

            // List container
            this.ul = document.createElement("ul");

            // All list options
            this.options.forEach((el, i) => {
                const li = document.createElement("li");
                li.dataset.value = el.value;
                li.innerText = el.innerText;

                if (i === 0) {
                    // First clickable option
                    this.current = document.createElement("div");
                    this.current.innerText = el.innerText;
                    this.dropdown.appendChild(this.current);
                    this.valueInput.value = el.value;
                    li.classList.add("selected");
                }

                this.ul.appendChild(li);
            });

            this.dropdown.appendChild(this.ul);
            this.dropdown.appendChild(this.valueInput);
            this.$el.parentElement.appendChild(this.dropdown);
        }

        addEvents() {
            this.dropdown.addEventListener("click", e => {
                const target = e.target;
                this.dropdown.classList.toggle("selecting");

                // Save new value only when clicked on li
                if (target.tagName === "LI") {
                    this.valueInput.value = target.dataset.value;
                    this.current.innerText = target.innerText;
                }
            });
        }
    }

    document.querySelectorAll(".form-group--dropdown select").forEach(el => {
        new FormSelect(el);
    });

    /**
     * Hide elements when clicked on document
     */
    document.addEventListener("click", function (e) {
        const target = e.target;
        const tagName = target.tagName;

        if (target.classList.contains("dropdown")) return false;

        if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
            return false;
        }

        if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
            return false;
        }

        document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
            el.classList.remove("selecting");
        });
    });

    /**
     * Switching between form steps
     */
    class FormSteps {
        constructor(form) {
            this.$form = form;
            this.$next = form.querySelectorAll(".next-step");
            this.$prev = form.querySelectorAll(".prev-step");
            this.$step = form.querySelector(".form--steps-counter span");
            this.currentStep = 1;

            this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
            const $stepForms = form.querySelectorAll("form > div");
            this.slides = [...this.$stepInstructions, ...$stepForms];

            this.init();
        }

        /**
         * Init all methods
         */
        init() {
            this.events();
            this.updateForm();
        }

        /**
         * All events that are happening in form
         */
        events() {
            // Next step
            this.$next.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep++;
                    this.updateForm();
                });
            });

            // Previous step
            this.$prev.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.currentStep--;
                    this.updateForm();
                });
            });

            // Form submit
            this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
        }

        /**
         * Update form front-end
         * Show next or previous section etc.
         */
        updateForm() {
            this.$step.innerText = this.currentStep;

            // TODO: Validation

            // Hide organizations based on category
            document.getElementById("category_button").onclick = function () {
                var checkedValue = [];
                var inputElements = document.getElementsByName('categories');

                for (var i = 0; inputElements[i]; ++i) {
                    if (inputElements[i].checked) {
                        checkedValue.push(inputElements[i].value);
                    }
                }

                var div, organization, p, organizationValue, c, b;
                div = document.querySelectorAll("div input[name='organization']");

                for (b = 0; b < div.length; b++) {
                    div[b].parentNode.style.display = "";
                }

                for (c = 0; c < checkedValue.length; c++) {
                    for (p = 0; p < div.length; p++) {
                        organization = div[p].parentElement.parentElement;
                        organizationValue = organization.getAttribute('data-value');
                        if (organizationValue.indexOf(checkedValue[c]) < 0) {
                            div[p].parentNode.style.display = "none";
                        }
                    }
                }
            }

            // Add event to name categories
            var categories = document.getElementsByName("categories");
            for (var i = 0; categories[i]; ++i) {
                categories[i].addEventListener("click", validateCategories, false)
            }

            // Validate if checkbox with name categories is checked
            function validateCategories() {
                var checked = 0;
                var button = document.getElementById('category_button')

                var categories = document.getElementsByName("categories");

                for (var i = 0; i < categories.length; i++) {
                    if (categories[i].checked) {
                        checked++;
                    }
                }

                if (checked > 0) {
                    button.style.display = "block";
                } else {
                    button.style.display = "none";
                }
            }

            // Add event to bags input
            document.getElementById("bags").addEventListener("keyup", validateBags, false);

            // Validate if bags quantity is properly inputted
            function validateBags() {
                var bags_button = document.getElementById('bags_button');
                if (this.value.length > 0 && this.value > 0) {
                    bags_button.style.display = "block";
                } else {
                    bags_button.style.display = "none";
                }
            }

            // Add event to name organization
            var organizations = document.getElementsByName('organization');
            for (var x = 0; organizations[x]; ++x) {
                organizations[x].addEventListener("click", validateOrganization, false)
            }

            // Validate if checkbox with name categories is checked
            function validateOrganization() {
                var organization_button = document.getElementById("organization_button");

                if (this.checked) {
                    organization_button.style.display = "block";
                }
            }

            // Uncheck if user returns to previous slides
            document.getElementById("bags_button").addEventListener("click", function () {
                var organizations = document.getElementsByName('organization');
                for (var i = 0; organizations[i]; ++i) {
                    organizations[i].checked = false;
                    organization_button.style.display = "none";
                }
            })

            // Add event to name inputs in div with address
            var address_detail = document.querySelectorAll("div[data-step='4'] input");
            for (var c = 0; address_detail[c]; ++c) {
                address_detail[c].addEventListener("keyup", validateAddress, false);
            }

            function validateAddress() {
                var summary_button = document.getElementById('summary_button');

                var address = document.getElementsByName("address")[0];
                var city = document.getElementsByName("city")[0];
                var postcode = document.getElementsByName("postcode")[0];
                var phone = document.getElementsByName("phone")[0];
                var date = document.getElementsByName("data")[0];
                var time = document.getElementsByName("time")[0];

                function validLength(element) {
                    return element.value.length > 0;
                }

                function validPostcode(elementValue) {
                    var zipCodePattern = /^\d{2}-\d{3}$/;
                    return zipCodePattern.test(elementValue);
                }

                if (validLength(address && city && postcode && phone && date && time) && validPostcode(postcode.value)) {
                    summary_button.style.display = "block";
                } else {
                    summary_button.style.display = "none";
                }
            }

            this.slides.forEach(slide => {
                slide.classList.remove("active");

                if (slide.dataset.step == this.currentStep) {
                    slide.classList.add("active");
                }
            });

            this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
            this.$step.parentElement.hidden = this.currentStep >= 6;

            // TODO: get data from inputs and show them in summary

            document.getElementById("summary_button").onclick = function () {
                var bags_quantity = document.getElementsByName("bags")[0].value;
                var address = document.getElementsByName("address")[0].value;
                var city = document.getElementsByName("city")[0].value;
                var postcode = document.getElementsByName("postcode")[0].value;
                var phone = document.getElementsByName("phone")[0].value;
                var date = document.getElementsByName("data")[0].value;
                var time = document.getElementsByName("time")[0].value;
                var more_info = document.getElementsByName("more_info")[0].value;

                document.getElementById("summary_bags").innerHTML = "Liczba worków: " + bags_quantity;
                document.getElementById("street").innerHTML = address;
                document.getElementById("city").innerHTML = city;
                document.getElementById("postcode").innerHTML = postcode;
                document.getElementById("phone").innerHTML = phone;
                document.getElementById("date").innerHTML = date;
                document.getElementById("time").innerHTML = time;
                document.getElementById("more_info").innerHTML = more_info;

                if (more_info === "") {
                    document.getElementsByName('more_info')[0].value = "Brak uwag";
                    document.getElementById("more_info").innerHTML = "Brak uwag";
                }
            }

        }

        /**
         * Submit form
         *
         * TODO: validation, send data to server
         */

        create_post() {
            var csrftoken = $("[name=csrfmiddlewaretoken]").val();
            var form = $('#donation_form');
            var formData = form.serialize();
            $.ajax({
                url: "/donation/", // the endpoint
                type: "POST", // http method
                headers: {
                    "X-CSRFToken": csrftoken
                },
                data: formData, // data sent with the post request

                // handle a successful response
                success: function (json) {
                    $('#bags').val(''); // remove the value from the input
                    console.log(json); // log the returned json to the console
                    console.log("success"); // another sanity check
                    window.location='/success/'
                },

                // handle a non-successful response
                error: function (xhr, errmsg, err) {
                    $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                    console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                }
            });
        };

        submit(e) {
            e.preventDefault();
            this.create_post();
        }
    }

    const form = document.querySelector(".form--steps");
    if (form !== null) {
        new FormSteps(form);
    }
});

$(document).ready(function() {
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
});