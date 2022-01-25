# Development Philosophies #

## "Local" vs "Cloud" Environments - *The Golden Hammer* ##

The *Golden Hammer* is a more plaguing, yet commonly found Anti-Pattern in the Software Development industry; the
anti-pattern is best described:

> *A software development team has gained a high level of competence in a particular solution or vendor
> product, referred to here as the **Golden Hammer**.*
>
> As a result, every new product or development effort is viewed as something that is best solved with it.
> In many cases, the Golden Hammer is a mismatch for the problem, but minimal effort is devoted to exploring
> alternative solutions.

Using the cloud to ***extend local development*** is a difficult, yet fun and creative problem that's often impossible
to perfectly establish. But globally distributed micro-services cannot be limited to a single system's local
environment.

Moreover, development that's kept only local is unrealistic and prevents teams from foreseeing issues with distributing
their source code and preventing bad [code smell](https://en.wikipedia.org/wiki/Code_smell):

- Poor or Absent Logging
- Packaging Problems
- Black-Box Bugs

Large benefits become immediately available when interfacing the cloud:

- The potential for secrets to leak is forcefully limited
- Debugging becomes resolvable from a single point of failure
- Onboarding is faster and training less costly

Development teams will spend less time overall configuring their local systems -- configuration that should limited to
their cloud-targeted application(s) anyways.

## Determining Support Systems ##

Distributed systems such as databases or caching servers are often too much of a burden to
configure, run, and then perfectly replicate in a local environment. 100% of the time, it's
best to leave these resources in the cloud, regardless of local vs. cloud context(s). Failure
to establish a shareable support system amounts in massive technical debt that's forced on external
teams -- logarithmically if drift or misconfiguration surfaces.

The justification is rather easily explained: [**Backing Services**](https://12factor.net/backing-services)

Perhaps surprisingly, **such support system(s) includes all databases**; e.g. An authorization service's
database, or an organization's central data-warehouse.

**Limitus Test**: should a deployable prevent pushing its distribution if a support system isn't available, or will the
runtime of the application result in failure to keep alive without it?
- If the answer is "Yes" -- reconsider the definition of a "dependency" and "micro-service".

The language above is intentionally harsh because of the burden associated with long term maintenance. Especially
when support system modifications attempt to never require code changes from linked repositories, but almost always
requires IaC reconfiguration *and* code changes when un-accounted, non-persistent mutations occur.

## Runtime Configuration ##

Backend applications often need to **dynamically reconfigure runtime(s) or runtime logic**.

The most simple example includes changing a variable's value to a URL according to an environment.

But, most importantly, note that configuration **doesn't always mean *environment
variables***. See the section [*Process Management*](#process-management) for an equally
large configuration concern.

### Process Management ###

Let's acknowledge that `npm` isn't always available as the process manager.

Use-cases & examples:

- Entry points that are invoked via a proprietary framework
  - AWS **Lambda**
  - Azure **Functions**
- Invocation via `forever` and `pnm2`, or via a daemon manager such as `systemd`
  - A long running polling service
  - Orchestrator or Security Monitors
  - A CI-CD Runner
  - QA Application(s) (`selenium grid`)
- Locked, virtualized environments (Containers)
  - Anything that requires `node` vs `npm` to invoke a packaged entry point

## Additional Documentation, and Recommendations ##

### Abstractionists versus Implementationists ###

Programming ability rarely ever equates to skill in defining abstractions.

There appear to be two distinct groups involved in software development: **abstractionists**, and their counterparts (
whom we call **implementationists**).

Abstractionists are comfortable discussing software design concepts without delving into implementation details.

As stated, they possess the architecture instinct, the ability to define and explain good software abstractions.
Implementationists, on the other hand, often require source code examples before they can grasp abstract concepts; they
are not particularly adept at defining new abstractions that can be readily understood by other developers.

Many object-oriented processes are egalitarian; design decisions made in meeting processes are approved by consensus.
According to experts, implementationists outnumber abstractionists approximately 4 to 1 Thus, unfortunately,
abstractionists are often outvoted.

Abstractionists know instinctively that management of complexity is a key design force. Good abstractions are often
compromised because so few developers appreciate their significance.

The primary consequence is software designs with excessive complexity, which make the system difficult to develop,
modify, extend, document, and test. Software usability and system maintenance are impacted by a failure to use effective
abstraction principles.

The egalitarian approach to object-oriented development has been rather ineffective in practice; it is reminiscent of a
group of people charging up a hill simultaneously.

Everyone must understand and concur on numerous decisions, and even though there may be sophisticated members, the
overall sophistication of the group is diminished to the lowest common denominator and inhibited by the communication
process.

### Silos ###

In some architecture and management circles, there is an explicit policy to isolate feature developers from the system's
maintainers. Requirements are passed second-hand through intermediaries, including architects, managers, or requirements
analysts. This is an anti-pattern known as ***Mushroom Management***.

Mushroom management assumes that requirements are well understood by both the development team(s) and system maintainers
***at project inception***. It is assumed that requirements are stable. More times than not, however, the supporting
individuals or outside stakeholders are forced to accommodate bad design(s) -- not necessarily bad code.

Realistically, the outcome shows *unstable requirements* due to **negation of the support-related requirement(s)**.

#### Technical Debt ####

When developers don't understand the overall requirements of a product, they rarely understand the required component
interaction and necessary interfaces (infrastructure, cloud control, security and QA integrations).

The outcome amounts to [stovepipe](#stovepipe) components with weak interfaces that do not fulfill the functional
requirements.

### Stovepipe ###

An Anti-Pattern, the Stovepipe, occurs when migrating an existing software system to a distributed infrastructure.

If the same design is used for distributed computing, a number of problems emerge.

For example, the existing interfaces may be using fine-grain operations to transfer information that may be inefficient
in a distributed environment. Preexisting interfaces are usually implementation-specific, and will cause subsystem
interdependencies when used in a larger-scale distributed system.

Local operations often make various assumptions about location, including address space and access to the local file
system. Excess complexity can arise when multiple existing interfaces are exposed across a larger-scale distributed
system.

### Recommendations ###

#### Module(s) ####

When using `node` & `commonjs` modules, it's important to know:

```js
module.exports = exports = {};
```

`module.exports` and `exports` refer to the same object.

Use of `module.export` vs `export` is preferred; given `module` is of a
special type [`NodeModule`](https://nodejs.org/api/modules.html), use of `module` will allow
IDEs to programmatically evaluate errors or anti-patterns, and will overall facilitate
development with type-hinting and inline documentation.