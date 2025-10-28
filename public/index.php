<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', 1);

require __DIR__ . '/../vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader(__DIR__ . '/../templates');
$twig = new Environment($loader, [
    'debug' => false,
    'strict_variables' => true
]);

$page = $_GET['page'] ?? 'landing';

$routes = [
  'landing'   => 'landing.twig',
  'login'     => 'auth_login.twig',
  'signup'    => 'auth_signup.twig',
  'dashboard' => 'dashboard.twig',
  'tickets'   => 'tickets.twig',
];

$template = $routes[$page] ?? 'landing.twig';

echo $twig->render($template, ['page' => $page]);
