const rows = document.querySelectorAll('.row');
const btns = document.querySelectorAll('button');

const genElementName = (itemId, text)=>{
    let result = '';
    if(itemId.length === 10){
        result = `${itemId[0]}${text}${itemId[itemId.length - 2]}${itemId[itemId.length - 1]}`
    } else {
        result = `${itemId[0]}${text}${itemId[itemId.length - 1]}`
    }
    return result
}

btns.forEach(item => {
    item.addEventListener('click', ()=>{
        const id = item.id
        console.log(id)
        if(id.length === 10){
            const monthName = genElementName(id, 'Month');
            open(`monthlyStatement/${document.querySelector(monthName).innerText}`,'_blank')
        } else {
            const monthName = genElementName(id, 'Month');
            console.log(monthName)
            open(`../../views/auth/monthlyStatement/${document.querySelector(`#${monthName}`).innerText}`,'_blank')
        }
    })
});