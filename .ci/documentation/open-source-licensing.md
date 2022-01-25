# Open Source #

[*Choosing a License*](https://choosealicense.com)

- [License(s) Overview](https://choosealicense.com/licenses/)

## Acceptable Open Source Libraries ##

**Libraries with the following licenses are acceptable for use**:

- [MIT License](https://choosealicense.com/licenses/mit/) (the MIT Expat License specifically): The MIT License requires
  that the license itself is included with all copies of the source. It is a permissive (non-copyleft) license as
  defined by the Open Source Initiative.
    - Example Libraries & Platforms
        - Node.js
- [Apache 2.0 License](https://choosealicense.com/licenses/apache-2.0/): A permissive license that also provides an
  express grant of patent rights from contributors to users.
    - Example Libraries & Platforms
        - Kubernetes
        - PDF.js
        - Swift
        - tensorflow
- [Ruby 1.8 License](https://github.com/ruby/ruby/blob/ruby_1_8_6/COPYING): Dual-licensed under either itself or the
  GPLv2, defer to the Ruby License itself. Acceptable because of point 3b: "You may distribute the software in object
  code or binary form, provided that you do at least ONE of the following: b) accompany the distribution with the
  machine-readable source of the software."
- [Ruby 1.9 License](https://www.ruby-lang.org/en/about/license.txt): Dual-licensed under either itself or the BSD
  2-Clause License, defer to BSD 2-Clause.
- [BSD 2-Clause License](https://opensource.org/licenses/BSD-2-Clause): A permissive (non-copyleft) license as defined
  by the Open Source Initiative.
    - GO Programming Language
    - Django Python Framework
    - NumPy
    - Nginx
- [BSD 3-Clause License](https://opensource.org/licenses/BSD-3-Clause) (also known as New BSD or Modified BSD): A
  permissive (non-copyleft) license as defined by the Open Source Initiative
    - GO Programming Language
    - Django Python Framework
    - NumPy
    - Nginx
- [ISC License](https://opensource.org/licenses/ISC) (also known as the OpenBSD License): A permissive (non-copyleft)
  license as defined by the Open Source Initiative.
- [Creative Commons Zero](https://creativecommons.org/publicdomain/zero/1.0/) (CC0): A public domain dedication,
  recommended as a way to disclaim copyright on your work to the maximum extent possible.
- [Unlicense](https://unlicense.org/): Another public domain dedication.
- [OWFa 1.0](http://www.openwebfoundation.org/legal/the-owf-1-0-agreements/owfa-1-0): An open-source license and patent
  grant designed for specifications.
- [JSON License](https://www.json.org/license.html): Equivalent to the MIT license plus the statement, "The Software
  shall be used for Good, not Evil."

## Unacceptable Licenses ##

**Libraries with the following licenses are not permitted**:

- [GNU GPL](https://choosealicense.com/licenses/gpl-3.0/) (version 1, version 2, version 3, or any future versions):
  GPL-licensed libraries cannot be linked to from non-GPL projects.
- [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/): AGPL-licensed libraries cannot be linked to from non-GPL
  projects.
- [Open Software License](https://opensource.org/licenses/OSL-3.0) (OSL): is a copyleft license. In addition, the FSF
  recommend against its use.
- [GNU Lesser General Public License](https://choosealicense.com/licenses/lgpl-3.0/) (GNU LGPL) (version 2, version 3):
  GPL constraints regarding modification and redistribution under the same license are not required of projects using an
  LGPL library, only upon modification of the LGPL-licensed library itself.

## Notes ##

Decisions regarding the GNU GPL licenses are based on information provided by The GNU Project, as well as the Open
Source Initiative, which both state that linking GPL libraries makes the program itself GPL.

If a library uses a license which is not listed above, open an issue and ask. If a license is not included in the "
acceptable" list, operate under the assumption that it is not acceptable.

Keep in mind that each license has its own restrictions (typically defined in their body text). Please make sure to
comply with those restrictions at all times whenever an external library is used.

Dependencies which are only used in development or test environment are exempt from license requirements, as they're not
distributed for use in production.

*This document is not legal advice, nor is it comprehensive. It should not be taken as such.*

## Sources ##

- https://tldrlegal.com
- https://choosealicense.com
- https://opensource.org/licenses
- https://github.com/todogroup/policies
- https://about.gitlab.com/handbook/engineering/open-source/
- https://opensource.google/docs/
- https://opensource.microsoft.com/program/#program-using
- https://opensource.guide