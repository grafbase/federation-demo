{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:
{
  packages = with pkgs; [
    git
    nodejs
  ];
  enterShell = ''
    export PATH="$DEVENV_ROOT/node_modules/.bin:$PATH"
  '';
}
