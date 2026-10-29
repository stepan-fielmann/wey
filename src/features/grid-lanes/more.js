/*
  Demo helper, the same on all three pages and not part of the comparison:
  "Load more" appends six more cards to the gallery, like infinite scroll.
*/
(function () {
  var MORE = [
    ['copper-canyon', 'Copper Canyon', 'Red walls at noon', 560],
    ['moonlit-pines', 'Moonlit Pines', 'A clear winter night', 380],
    ['sunlit-leaves', 'Sunlit Leaves', 'Late summer', 500],
    ['tidal-shapes', 'Tidal Shapes', 'Low tide patterns', 320],
    ['aurora-ridge', 'Aurora Ridge, again', 'The second night', 440],
    ['salt-dunes', 'Salt Dunes, again', 'Morning wind', 600]
  ];
  var gallery = document.querySelector('.gallery');
  var button = document.createElement('button');
  button.className = 'more';
  button.textContent = 'Load more';
  gallery.after(button);

  button.addEventListener('click', function () {
    MORE.forEach(function (m) {
      var tile = document.createElement('figure');
      tile.className = 'tile';
      tile.innerHTML = '<img alt="" width="400"><figcaption><span></span></figcaption>';
      var img = tile.querySelector('img');
      img.src = '{{images}}/scenes/' + m[0] + '.svg';
      img.height = m[3];
      tile.querySelector('figcaption').prepend(m[1]);
      tile.querySelector('span').textContent = m[2];
      gallery.append(tile);
    });
  });
})();
