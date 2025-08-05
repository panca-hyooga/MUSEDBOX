const C_MUSEDBOX = new MUSEDBOX;

(function disquss_chatbox_configuration(){
    //disable disquss load when we are on a local machine
    if(ENVAR.envname !== 'remotehost'){
        console.log('Disquss has disabled on local machine');
        return; //<------- stop disquss chatbox loading here.
    };

    C_MUSEDBOX.PORT.gchatbox.fillroom({htmlstring:`<div id="disqus_thread"></div>`});

    /**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */

    /*
    var disqus_config = function () {
        this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    */

    (function() { // DON'T EDIT BELOW THIS LINE
        var d = document, s = d.createElement('script');
        s.src = 'https://musedbox.disqus.com/embed.js';
        s.setAttribute('data-timestamp', + new Date());
        (d.head || d.body).appendChild(s);
    })();

})();