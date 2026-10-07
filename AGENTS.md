# Architecture rules

- The root and legacy login URLs redirect to the inventory dashboard; public UI access must not grant authenticated roles or bypass Cloud authorization.
- Initialize the local inventory working store independently of authentication so the dashboard can render without a login screen.