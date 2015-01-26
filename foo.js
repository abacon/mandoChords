var chordData = {}; 
var ticks = 0; 
_.each(chordsList, function(bucket, idx, lst) {
  var bucketName = bucket.split(",")[0];
  _.each(bucket, function(chord, idx, lst) {
    ticks++;
    $.ajax(getChordURL(chord), {success: function(data) {
      var ctx = $(data);
      if (!_.has(chordData, bucketName)) { chordData[bucketName] = []; }
      chordData[bucketName].push(parseChords(ctx));
    }});
    if (ticks > 2) { return; }
  });
});
