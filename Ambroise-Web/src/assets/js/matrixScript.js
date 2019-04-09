window.onload = charged;
window.onchange = charged;

function charged(){
        setTimeout(() => {
            if (document.getElementsByClassName('list-item') != null || document.getElementsByClassName('list-item') != undefined){
                let itemList = document.getElementsByClassName('list-item');
                for(let item of itemList){
                    item.addEventListener('click',test,false);
                }
            }
            createMatrix("myChartCompetence", ['c++', 'Java', '',], [3, 3.5, 0]);
            createMatrix("myChartSoftSkill", ['Scrum', 'Skill', '',], [3, 3, 0]);
        },50);
}

function test(event){
    console.log("Bonjour");
    let parentNode = event.target.parentNode;
    while(parentNode.nodeName != "ONS-LIST-ITEM"){
        parentNode = parentNode.parentNode;
    }
    let id = parentNode.id.substr(4,1);
    document.getElementById('appTabbar').setActiveTab(id);
    document.getElementById('menu').close();
}

function createMatrix(chartId, labels, data){
    var ctx = document.getElementById(chartId).getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Note',
            data: data,
            backgroundColor: [
                'rgba(00, 139, 210, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                'rgba(00, 139, 210, 1)',
                'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {

        },
        responsive: true,
        maintainAspectRatio: false
    }
});
}
