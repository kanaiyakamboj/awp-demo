$(document).ready(function(){
    $(".ToggleBtn").click(function(){
        $(".ToggleDiv").toggleClass("Active");
    });

    const buttons = document.querySelectorAll(".collpase-btn");
    buttons.forEach((button) => {
    button.addEventListener("click", () =>
        button.parentElement.parentElement.parentElement.classList.toggle("active")
    );
    });

    const buttons2 = document.querySelectorAll(".resize-div");
    buttons2.forEach((button) => {
    button.addEventListener("click", () =>
        button.parentElement.parentElement.parentElement.classList.toggle("fullscreen")
    );
    });
});

