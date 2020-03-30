// import { Router } from "express";

document.querySelector('#menu').addEventListener('click', function(){
    const optionsDiv = document.querySelector('#menuOptions');
    if(optionsDiv.style.display === 'none'){
        optionsDiv.style.display = 'block';
    } else {
        optionsDiv.style.display = 'none';
    }
})

const dollarAmount = document.querySelector('#dollarAmount');

const today = () =>{
    return `${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}`;
}


const checkForNumbers = (val) => {
    if(val !== ''){
        let f = 0;
        let dot = 0;
        for (const i of val){
            if(isNaN(Number(i)) && i !== '.'){
                f++;
            }
            if(i === '.'){
                dot++
            }
        }
        return dot > 1 || f > 0;
    } else if(val === ''){
        return false;
    }
}

// window.addEventListener('load', (event) => {
//     alert('test')
//   });

// document.querySelector('#submit').addEventListener('click', ()=>{
//     if(checkForNumbers(dollarAmount.value)){
//         alert('this work?')
//         location.reload()
//     } else {
//         Router.post('/auth/creditDebit')
//     }
// }
// )