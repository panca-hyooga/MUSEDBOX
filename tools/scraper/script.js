const inputTrackPackname = document.getElementById('input-track-packname');
const inputStartingIDs = document.getElementById('input-starting-ids');

const el_scraper = Object.freeze({
    button_submit : document.getElementById('button-scrap-submit'),
    textarea_source : document.getElementById('textarea-scrap-source'),
    textarea_result : document.getElementById('textarea-scrap-result'),
});

const el_replacer = Object.freeze({
    button_submit : document.getElementById('button-replace-submit'),
    textarea_source : document.getElementById('textarea-replace-source'),
    textarea_result : document.getElementById('textarea-replace-result'),
});

el_scraper.button_submit.addEventListener('click', function(e){
    const carier = document.createElement('div');
    carier.innerHTML = el_scraper.textarea_source.value;

    if(!carier.querySelector('.wikitable')){
        throw new Error('please put html string with table element having css classes namely "wikitable"');
    };

    if(!inputTrackPackname || !inputTrackPackname.value){
        throw new Error('no trackpackname provided yet');
    };

    const trs = Array.from(carier.querySelectorAll('tbody > tr'));

    const songdataarr = [];

    let startingid = inputStartingIDs.value ? parseInt(inputStartingIDs.value) : -1111111;

    for(let i=trs.length-1;i>=2;i--){
        songdataarr.unshift({
            id: startingid,
            trackPackname: inputTrackPackname.value,
            album: carier.querySelector('table > caption').textContent.trim(),
            title: trs[i].querySelector('td:nth-child(2)').innerText.trim(),
            logo: trs[i].querySelector('td:nth-child(1) img').dataset.imageKey,
            artist: trs[i].querySelector('td:nth-child(3)').innerText.trim(),
            link: "https://youtube.com/embed/",
        });

        inputStartingIDs.value ? startingid -= 1 : null;
    };

    el_scraper.textarea_result.value = JSON.stringify({content:songdataarr});
});

el_replacer.button_submit.addEventListener('click', function(e){
    fetch('http://localhost/musedbox/tbl-music-card.json') // Replace 'data.json' with your actual JSON file or API endpoint URL
    .then(response => {
        // Check if the network response was successful (status code 200-299)
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the response body as JSON
        return response.json();
    })
    .then(data => {
        // Work with the parsed JSON data
        
        const fetched_data = data.content;
        const TextareaInputJsonObj = JSON.parse(el_replacer.textarea_source.value).content;

        const [listnotfound, listfound] = [[],[]];

        TextareaInputJsonObj.forEach(objjj => {
            const finding = fetched_data.find(aaaa => aaaa.title === objjj.title);
            if(finding){

                objjj.id = finding.id;
                objjj.link = finding.link;
                objjj.logo = finding.logo;

                //for checking and debugging, we store each comparison into an array. so we can check it manually.
                listfound.push({wiki: objjj.title, tbl_music_card_json: finding.title});
            }else{
                //for checking and debugging, we store each comparison into an array. so we can check it manually.
                listnotfound.push(objjj.title);
            };
        });

        console.log(listfound);
        console.log(listnotfound);

        (function extra_function(){
            i = 1;
            TextareaInputJsonObj.forEach(obiji => {
                obiji.id = i;
                i+=1;
            });
        })();

        el_replacer.textarea_result.value = JSON.stringify({content:TextareaInputJsonObj});
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('There was a problem with the fetch operation:', error);
    });
});