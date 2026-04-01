<?php

use Illuminate\Support\Facades\Route;

Route::group([], function () {
    $currentDirectory = __DIR__ ;
    foreach (glob($currentDirectory . '/*Router.php') as $partial) {
        require $partial;
    }
});