/**
 * Created by likai on 西暦16/01/27.
 */
var cheerio = require('cheerio');
var fs = require('fs');
var util = require("./util.js");
var config = require('../config.js');

var parse = {
    processPage:function(id,response){
        $ = cheerio.load(response.body);
        var count = this.getViewCount($,id);

        if(count && count >config.minViewCount){
            let prasedurl = this.getUrl($);
            const data = {
                "url":prasedurl? prasedurl:id,
                "count":count,
                "tag":this.getTag($),
                "author":this.getAuthor($)
            }

            return data;

        } else{
            return undefined;
        }

    },

    getViewCount:function($,id){
        var viewCount = util.coalesce($('dd.view-count').html(),$('li.info span.views').html());
        if(!viewCount){
           // console.log(id,"may have been deleted");
            return undefined;
        }
        return viewCount;

    },
    getTag:function($){
        var tagHtml = $('li.tag a.text').html();
        if(!tagHtml){
            return undefined
        }
        var tag = tagHtml.toString().replace(/<span.*<\/span>/,"");

        return unescape(tag.replace(/&#x/g,'%u').replace(/;/g,''));

    },
    getUrl:function($) {
        var imgURL = util.coalesce($('li.selected_works a img').attr('src'),$('div.works_display div.ui-modal-trigger img').attr('src'));
        if(imgURL){
            imgURL = imgURL.replace(/c\/.*\/img-master/,"img-original").replace('p0_master1200', 'p0');
            return imgURL;
        }
        return undefined;

    },
    getAuthor:function($){
        let author = $('div.profile-unit a.user-link h1.user').html();
        if(!author) return undefined;
        return unescape(author.replace(/&#x/g,'%u').replace(/;/g,''));

    }

}



module.exports = parse;