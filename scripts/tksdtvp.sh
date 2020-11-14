#!/bin/bash

# Wrapper Script for Kinston DataTraveler Vault Privacy 3.0
# https://www.unixsys.org/articles/wrapper-script-kingston-datatraveler-vault-privacy-3-0-23/



function errecho(){

    (>&2 echo "${@}");

}



function usage(){

    echo -e "Usage:\n\tksdtvp (login|logout|initialize|forgotpass|about)"

}



function getarch(){

    if [[ $(uname -m) = "x86_64" ]]; then

        echo "64"

    elif [[ $(uname -m) =~ [i.86] ]]; then

        echo "32"

    fi

}



function main(){

    _scriptspath="/media/$(whoami)/DTVP301/linux/linux$(getconf LONG_BIT)"



    if [[ ! "${@}" ]]; then

        errecho "Missing Argument"

        usage

        exit 1

    elif [[ ! -d "${_scriptspath}" ]]; then

        errecho "Device Not Found"

        exit 1

    else

        case "${1}" in

            "login" ) ${_scriptspath}/dtvp_login ;;

            "logout" ) ${_scriptspath}/dtvp_logout ;;

            "about" ) ${_scriptspath}/dtvp_about ;;

            "initialize" ) ${_scriptspath}/dtvp_initialize ;;

            "forgotpass" ) ${_scriptspath}/dtvp_forgotpassword ;;

            * ) errecho "Invalid Argument" ; usage ; exit ;;

        esac

    fi

}



main "${@}"
