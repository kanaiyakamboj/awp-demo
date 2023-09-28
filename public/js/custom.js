$(document).ready(function(){
    $(".ToggleBtn").click(function(){
        $(".ToggleDiv").toggleClass("Active");
    });
});

// Quick & dirty toggle to demonstrate modal toggle behavior
$('.MenuToggle').on('click', function(e) {
    e.preventDefault();
    $('.MainMenu').toggleClass('is-visible').animate({ top: 0 });
  });

 

  function filterPopup(e){
    $('.FilterModal').toggleClass('is-visible').animate({ top: 0 });
      
       }
  function modalPopup(e){
 $('.StepInstructionModal').toggleClass('is-visible').animate({ top: 0 });
   
    }
//   $('.StepInstructionBtn').on('click', function(e) {
    // e.preventDefault();
    // $('.StepInstructionModal').toggleClass('is-visible').animate({ top: 0 });
//   });

  $(document).ready(function(){
    $(".PannelIcon").click(function(){
        $(this).toggleClass("Active", {duration:3000});
        $(".PannelIcon2").removeClass("Active", {duration:3000});
        $(".AsideBarRight").toggleClass("RightPanel1Active");
        $(".AsideBarRight").removeClass("RightPanel2Active");
        $(".RightPanel1").toggleClass("Active");
        $(".RightPanel2").removeClass("Active");
        $(".ContentWrapper").toggleClass("ChangeFlex");
        $(".ContentWrapper").removeClass("panel2");
    });

    $(".PannelIcon2").click(function(){
        $(this).toggleClass("Active", {duration:3000});
        $(".PannelIcon").removeClass("Active", {duration:3000});
        $(".AsideBarRight").toggleClass("RightPanel2Active");
        $(".AsideBarRight").removeClass("RightPanel1Active");
        $(".RightPanel1").removeClass("Active");
        $(".RightPanel2").toggleClass("Active");
        $(".ContentWrapper").toggleClass("panel2");
        $(".ContentWrapper").removeClass("ChangeFlex");
    });
    $(".LeftPannelIcon1").click(function(){
        $(this).toggleClass("Active", {duration:3000});
        $(".AsideBarLeft").toggleClass("AsideBarLeftActive");
        $(".ContentWrapper").toggleClass("panel3");
        $(".ContentWrapper").removeClass("ChangeFlex");
        $(".ContentWrapper").removeClass("panel2");
    });
    
});
// function LeftPannelIcon(event){
//     event.currentTarget.toggle("Active");
//     $(".AsideBarLeft").toggleClass("AsideBarLeftActive");
//     $(".ContentWrapper").toggleClass("panel3");
//     $(".ContentWrapper").removeClass("ChangeFlex");
//     $(".ContentWrapper").removeClass("panel2");
// }
function collpaseButton(event){
    // const buttons = document.querySelectorAll(".collpase-btn");
    // buttons.forEach((button) => {
    //   button.addEventListener("click", () =>
    //   event.parentElement.parentElement.parentElement.classList.toggle("active")
    //   );
    // });   
    event.currentTarget.parentElement.parentElement.parentElement.classList.toggle("active")
}


const buttons2 = document.querySelectorAll(".resize-div");
buttons2.forEach((button) => {
  button.addEventListener("click", () =>
    button.parentElement.parentElement.parentElement.classList.toggle("fullscreen")
  );
});

