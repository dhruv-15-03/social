# Security Policy

## Supported Versions
Security fixes apply to the latest `main` branch. Older snapshots are not maintained.

## Reporting a Vulnerability
If you discover a security vulnerability:
1. **Do NOT open a public issue.**
2. Email: `SECURITY_CONTACT_PLACEHOLDER@example.com` (replace when formal contact established)
3. Provide: steps to reproduce, impact, affected components, any PoC.
4. You will receive an acknowledgment within 72 hours.

## Handling Process
| Phase | Description |
|-------|-------------|
| Triage | Validate report, assess severity (CVSS-style) |
| Fix | Patch developed in a private branch |
| Review | Security + maintainer review |
| Release | Patch merged, advisory published |
| Credit | Researcher credited unless opting out |

## Scope
Included: frontend dependency vulnerabilities, auth/session handling, exposure of sensitive data, XSS vectors, CSRF risks, logic flaws.
Excluded: social engineering, self-inflicted account compromise, non-production demos.

## Best Practices (Contributors)
- Never commit secrets (.env, tokens)
- Use HTTPS endpoints only
- Sanitize and validate user-generated content before render
- Avoid using `dangerouslySetInnerHTML`
- Prefer parameterized requests & centralized API client

## Disclosure Timeline
We aim for fix release within 14 days for high severity, 30 days for moderate, and as feasible for low.

## Future Enhancements
- Add security.txt
- Automated dependency scanning CI
- CSP & SRI policy documentation
- Hardened Content Security strategy
