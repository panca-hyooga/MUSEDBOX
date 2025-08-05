const ENVAR = new (class{
    #envname = String;
    #links = {
        ['tbl-music-card.json'] : String,
    };
    get envname(){return this.#envname;};
    get links(){return this.#links;};

    constructor(){
        const current_env_href = window.location.hostname;

        //change environment variables based on which server is it executed.
        switch (current_env_href){
            case 'localhost':
            case '127.0.0.1':

                this.#envname = 'localhost';
                this.#links["tbl-music-card.json"] = 'http://localhost/musedbox/tbl-music-card.json';
                console.log('you are now on the local server');

            break;
            default:

                this.#envname = 'remotehost';
                this.#links["tbl-music-card.json"] = 'https://panca-hyooga.github.io/MUSEDBOX/tbl-music-card.json';
                console.log('you are now on the remote server');
        };

        //prevent further changes to environment links.
        Object.freeze(this.#links);
    };
})();