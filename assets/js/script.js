// start loading page
let load=document.getElementById('loading')
setTimeout(() => {load.style.display='none'},2000);

let loader=document.getElementById('loader')
setTimeout(() => {loader.style.display='none'},3000);
//End loading page
//Auto writting funcation in home page
let i = 0;
let currentWordIndex = 0;
let words = ['Save Lives', 'Spread Love', 'Be Kind', 'Make a Difference',];

function autoWriting() {
    let word = words[currentWordIndex];
    $('.banner-title').html(word.slice(0, i));
    i++;
    if (i > word.length + 1) {
        i = 0;
        currentWordIndex++;
        if (currentWordIndex >= words.length) {
            currentWordIndex = 0;
        }
    }
}

setInterval(autoWriting, 200);






$(document).ready(function(){
    $('.feedback-slider').owlCarousel({
        loop: false,
        margin: 10,
        nav: true,
        items: 1,
        autoplay: true,
        navText: ["<i class = 'fas fa-arrow-left'></i>", "<i class = 'fas fa-arrow-right'></i>"]
    });

    // stop animation on resize
    let resizeTimer;
    $(window).resize(function(){
        $(document.body).addClass('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            $(document.body).removeClass('resize-animation-stopper');
        }, 400);
    });

    $('.navbar-show-btn').click(function(){
        $('.navbar-box').addClass('navbar-box-show');
    });

    $('.navbar-hide-btn').click(function(){
        $('.navbar-box').removeClass("navbar-box-show");
    })
});


function forget(){
    let forget=document.getElementById('forg')
let forpasssword=document.getElementById('forpasssword')
forget.addEventListener('click',() => {
    forpasssword.style.opacity='1'
    forgg.style.backgroundColor = 'rgba(1,1,1, 0.2)'
})
}
forget()

function forget2(){
let close=document.getElementById('close')
close.addEventListener('click',() => {
    forpasssword.style.opacity='0'
    forgg.style.backgroundColor =''
})

}
forget2()


//********************************************
let count=1;
function autoWritin() {
    let text='Welcome 👋'
    $('#msg').html(text.slice(0,count))
    count++
    if(count>text.length+1){
        count=1;
    }
}
setInterval(autoWritin, 400);

// start login page
const sign_in_btn = document.getElementById("sign-in-btn");
const sign_up_btn = document.getElementById("sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});




