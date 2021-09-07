'use strict';

const { cp } = require('fs');

const
    // node native
    http = require('http')
	// cheerio
  , cheerio = require('cheerio')
  , got = require('got')
    
  , xdccEuHttpClient = {
        get: (terms) => got(`https://www.xdcc.eu/search.php?searchkey=${encodeURIComponent(terms)}`)
			.then(resp => {
				const $ = cheerio.load(resp.body);
				const results = [];
				$('#table tbody tr').each((i, tr) => {
					const $tds = $(tr).find('td');
					const quickLinkData = $tds.eq(1).find('a').eq(1).data();
					const server = quickLinkData.s;
					const channel = quickLinkData.c;
					const botNick = $tds.eq(2).text();
					const packId = $tds.eq(3).text();
					const fileSize = $tds.eq(5).text();
					const fileName = $tds.eq(6).text();
					const packageInfo = {
						server,
						channel,
						botNick,
						packId,
						fileSize,
						fileName,
					};
					results.push(packageInfo);
				});
				return results;
			})
    }
  ;
  
module.exports = xdccEuHttpClient;