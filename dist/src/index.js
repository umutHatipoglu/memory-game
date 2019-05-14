import { Observable } from 'rxjs';
var observable = Observable.create((observer) => {
    observer.next('Hello World');
    observer.next('Hello Again!');
    observer.complete();
    observer.next('Bye');
});
observable.subscribe((x) => logItem(x), (error) => logItem('Error: ' + error), () => logItem('Completed'));
function logItem(val) {
    var node = document.createElement('li');
    var textnode = document.createTextNode(val);
    node.appendChild(textnode);
    document.getElementById("list").appendChild(node);
}
//# sourceMappingURL=index.js.map