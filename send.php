<?php


/**
 * This is an example script for sending
 * Push Notifications using the send.js node script
 * through PHP. 
 * Please use it as a reference only.
 */


$node_bin = "/usr/local/bin/node"; // for localhost
// $node_bin = "node";                // for ubuntu


// Payload for the message
$payload = new stdClass();
$payload->title = "My Title";
$payload->message = "hello message";
$payload->topic = "german";


$io = [
    0 => ['pipe', 'r'], // node's stdin
    1 => ['pipe', 'w'], // node's stdout
    2 => ['pipe', 'w'], // node's stderr
];

// arguments for send.js
$args = implode(" ", [
    "--title \"$payload->title\"",
    "--topic \"$payload->topic\"",
    "--message \"$payload->message\"",
    "--dry \"true\""
]);

// exec command with file pointers (io)
$proc = proc_open("$node_bin send.js $args", $io, $pipes);

$nodeStdout = $pipes[1]; // our end of node's stdout
$nodeStderr = $pipes[2]; // our end of node's stderr
if(fgets($nodeStderr) !== FALSE) {
    echo date('H:i:s '), "ERROR: ", fgets($nodeStderr);
}
else {
    echo date('H:i:s '), "SUCCESS: ", fgets($nodeStdout);
}

proc_close($proc);
echo date('H:i:s '), "DONE\n";