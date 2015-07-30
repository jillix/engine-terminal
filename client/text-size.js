// var $ = require("/jquery");
//
// // Text size plugin
// $.fn.textSize = function () {
//     var $self = this;
//
//     function getCharSize() {
//         var $span = $("<span>", { text: "foo" });
//         $self.children().first().append($span);
//         var size = {
//             width: $span.outerWidth() / 3
//           , height: $span.outerHeight()
//         };
//         $span.remove();
//         return size;
//     };
//
//     var charSize = getCharSize();
//
//     return {
//         x: Math.floor($self.width() / charSize.width)
//       , y: Math.floor($self.height() / charSize.height)
//     };
// };
