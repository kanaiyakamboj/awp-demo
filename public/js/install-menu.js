$(document).ready(function(){
    $(".LeftPannelIcon1").click(function(){
       toggleInstallMenu();
    }); 
});

function toggleInstallMenu() {
    $(".LeftPannelIcon1").toggleClass("Active", {duration:3000});
    $(".AsideBarLeft").toggleClass("AsideBarLeftActive");
    // $(".ContentWrapper").removeClass("ChangeFlex");
}

function handleInstallMenuItemClick() {
    toggelFilterMenu();
    // if install menu is already not opened
    if(!$(".AsideBarLeft").hasClass("AsideBarLeftActive")){
        toggleInstallMenu();
    }
}