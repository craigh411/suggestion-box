<?php
// Mocks some db results


$data = [
    'orange', 'blue', 'green', 'red', 'pink', 'brown', 'black', 'purple', 'yellow', 'violet', 'white',
    'light orange', 'light blue', 'light green', 'light red', 'light pink', 'light brown', 'light purple', 'light yellow', 'light violet',
    'dark orange', 'dark blue', 'dark green', 'dark red', 'dark pink', 'dark brown', 'dark purple', 'dark yellow', 'dark violet',
];

$search = (isset($_REQUEST['search'])) ? $_REQUEST['search'] : '';

$results = [];

if (!empty($search)) {
    $search = preg_quote($search, '~');
    $searchResults = preg_grep('~' . $search . '~', $data);

    $suggestions = [];
    $i = 0;
    foreach ($searchResults as $result) {
        $suggestions[$i]['suggestion'] = $result;
        $suggestions[$i]['url'] = "selected.php?selected={$result}";
        $i++;
    }

    if (count($suggestions)) {
        $results = ['suggestions' => $suggestions];
    }
}

echo json_encode($results);