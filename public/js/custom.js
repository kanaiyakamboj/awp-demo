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

  
 





