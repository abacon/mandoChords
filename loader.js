function parseChord(chordDiv) {
  var chord = {};
  chord.position = 0;
  chord.bars = [];
  chord.name = chordDiv.parentElement.parentElement.parentElement.innerText.trim();
  chord.variant = chordDiv.id.split("-")[1];
  chord.chord = chordDiv.innerText.split("\n").filter(function(line) { return line.trim() !== ""; }).filter(function(line) { return line.match(/^show/); }).map(parseLine);
  return chord;
}

function parseLine(line) {
  results = line.match(/frets=(\w*) string=(\w*)/);
  return [results[2], results[1]];
}

chordDivs = document.getElementsByClassName("fretboard");

var chords = [];
for (var i = 0; i < chordDivs.length; i++) {
  chords.push(parseChord(chordDivs[i]));
}

function mandolinCafe() {
  function getChordList() {
    var ticks = 0; var chordsList = {}; var bucket = ''; _.each(chords, function(it, idx, lst) {
      if (idx < lst.length - 1 && it == "G" && lst[idx-1] != "G") { bucket = lst[idx+1]; chordsList[bucket] = []; return; }
      chordsList[bucket].push(it);
      ticks++;
    });

    return chordsList;
  }

  function getChordURL(chord) {
      return "http://www.mandolincafe.com/cgi-bin/chords/ch.pl?chord=" + encodeURIComponent(chord);
  }

  function parseImages (imgList) {
    var chord = [];
    var coveredStrings = [];
    for (var i = 0; i < imgList.length; i++) {
      if (imgList[i].match(/^(5|7).+/)) {
        imgList[i] = imgList[i].substr(1);
      } else if (imgList[i].match(/10.+/)) {
        imgList[i] = imgList[i].substr(2);
      }
      switch (imgList[i]) {
        case "ooox":
          coveredStrings.push(1);
          break;
        case "ooxo":
          coveredStrings.push(2);
          break;
        case "ooxx":
          coveredStrings.push(1);
          coveredStrings.push(2);
          break;
        case "oxoo":
          coveredStrings.push(3);
          break;
        case "oxox":
          coveredStrings.push(3);
          coveredStrings.push(1);
          break;
        case "oxxo":
          coveredStrings.push(3);
          coveredStrings.push(2);
          break;
        case "oxxx":
          coveredStrings.push(3);
          coveredStrings.push(2);
          coveredStrings.push(1);
          break;
        case "xooo":
          coveredStrings.push(4);
          break;
        case "xoox":
          coveredStrings.push(1);
          coveredStrings.push(4);
          break;
        case "xoxo":
          coveredStrings.push(4);
          coveredStrings.push(2);
          break;
        case "xoxx":
          coveredStrings.push(1);
          coveredStrings.push(2);
          coveredStrings.push(4);
          break;
        case "xxoo":
          coveredStrings.push(4);
          coveredStrings.push(3);
          break;
        case "xxox":
          coveredStrings.push(4);
          coveredStrings.push(3);
          coveredStrings.push(1);
          break;
        case "xxxo":
          coveredStrings.push(4);
          coveredStrings.push(3);
          coveredStrings.push(2);
          break;
        case "xxxx":
          coveredStrings.push(4);
          coveredStrings.push(3);
          break;
       case "1":
          coveredStrings.push(1);
          chord.push([1,i]);
          break;
       case "2":
          coveredStrings.push(2);
          chord.push([2,i]);
          break;
       case "3":
          coveredStrings.push(3);
          chord.push([3,i]);
          break;
       case "4":
          coveredStrings.push(4);
          chord.push([4,i]);
          break;
       case "5":
          coveredStrings.push(1);
          coveredStrings.push(2);
          chord.push([1,i]);
          chord.push([2,i]);
          break;
       case "6":
          coveredStrings.push(2);
          coveredStrings.push(3);
          chord.push([2,i]);
          chord.push([3,i]);
          break;
       case "7":
          coveredStrings.push(4);
          coveredStrings.push(3);
          chord.push([4,i]);
          chord.push([3,i]);
          break;
       case "8":
          coveredStrings.push(1);
          coveredStrings.push(3);
          chord.push([1,i]);
          chord.push([3,i]);
          break;
       case "9":
          coveredStrings.push(4);
          coveredStrings.push(2);
          chord.push([4,i]);
          chord.push([2,i]);
          break;
       case "10":
          coveredStrings.push(4);
          coveredStrings.push(1);
          chord.push([4,i]);
          chord.push([1,i]);
          break;
      }
    }
    return chord;
  }

  function parseChords(context) {
    var chordName = $(".chordname", context)[0].innerText;
    var chords = _.map(
      $(".main", context),
      function(div) {
            return Array.prototype.map.apply(
                div.getElementsByTagName("img"),
               [function(img) {
                   return img.src.match("([^\/]*).gif$")[1];
               }]
            );
        }
    ).map(function(imgList, idx) {
        return {
          "position": 0,
          "bars": [],
          "name": chordName,
          "variant": idx + 1,
          chord: parseImages(imgList)
        };
    });
    return chords;
  }

  return JSON.stringify(parseChords());


}


var chordData = {};
var ticks = 0;
_.each(chordsList, function(bucket, idx, lst) {
  _.each(bucket, function(chord, idx, lst) {
    ticks++;
    $.ajax(getChordUrl(chord), {success: function(data) {
      var ctx = $(data);
      if (!_.has(chordData, bucket)) { chordData[bucket] = []; }
      chordData[bucket].push(parseChords(ctx));
    }});
    if (ticks > 2) { return; }
  });
});



ticks = 0; chordsList = {}; var bucket = ''; _.each(chords, function(it, idx, lst) {
  if (idx < lst.length - 1 && it == "G" && lst[idx-1] != "G") { bucket = lst[idx+1]; chordsList[bucket] = []; return; }
  chordsList[bucket].push(it);
  ticks++;
});
