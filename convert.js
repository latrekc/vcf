#!/usr/bin/env node
var mime = require('mimelib');
var fs = require('fs');

var list = [];
var item;
var index = 0;


fs.readFileSync('./marina.vcf').toString().split(/\r\n/g).forEach(function(row) {
	if(row === 'BEGIN:VCARD') {
		item = ''
	}

	if(row.match(/^(PRODID|X-ABUID):/)) {
		return;
	}

	if(row.match(/^(N|FN|ORG):/)) {
		var params = row.split(':')
		var str = params[1].replace(/;/g, ' ').trim();
		row = params[0] + ';CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:' + mime.encodeQuotedPrintable(str)
	}

	item += row + "\r\n"

	if(row === 'END:VCARD') {
		list.push(item)
		fs.writeFileSync('./result/' + index + '.vcf', item)
		fs.appendFileSync('./result/all.vcf', item)
		index++;
	}
})

console.log('convert ', list.length)
