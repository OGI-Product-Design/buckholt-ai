# Buckholt type sets

Type sets are predefined combinations of size, weight, line height and letter spacing for specific UI roles. Prefer these classes over assembling arbitrary typography values.

Use semantic HTML appropriate to the content structure; the Buckholt class controls the visual treatment.

## Display

Use display styles sparingly for standout moments such as page titles or hero content.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.display-03` | `typescale-10` | 56px / 3.5rem | Medium 500 | 64px / 4rem | -0.25px |
| `.display-02` | `typescale-09` | 40px / 2.5rem | Medium 500 | 48px / 3rem | 0px |
| `.display-01` | `typescale-08` | 36px / 2.25rem | Medium 500 | 44px / 2.75rem | 0px |

## Headline

Use headline styles for key section headings that structure and organise content.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.headline-03` | `typescale-07` | 32px / 2rem | Semibold 600 | 40px / 2.5rem | 0px |
| `.headline-02` | `typescale-06` | 28px / 1.75rem | Semibold 600 | 36px / 2.25rem | 0px |
| `.headline-01` | `typescale-05` | 24px / 1.5rem | Semibold 600 | 32px / 2rem | 0px |

## Title

Use title styles for card headings and smaller, self-contained content sections.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.title-03` | `typescale-05` | 24px / 1.5rem | Medium 500 | 32px / 2rem | 0px |
| `.title-02` | `typescale-04` | 20px / 1.25rem | Medium 500 | 24px / 1.5rem | 0px |
| `.title-01` | `typescale-03` | 16px / 1rem | Medium 500 | 24px / 1.5rem | 0.16px |
| `.title-00` | `typescale-02` | 14px / 0.875rem | Medium 500 | 20px / 1.25rem | 0.25px |

`Title 00` is documented as a companion to `Body 00`.

## Body

Use body styles for general reading content.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.body-02` | `typescale-03` | 16px / 1rem | Light 300 | 24px / 1.5rem | 0.16px |
| `.body-01` | `typescale-02` | 14px / 0.875rem | Light 300 | 20px / 1.25rem | 0.25px |
| `.body-00` | `typescale-01` | 12px / 0.75rem | Light 300 | 16px / 1rem | 0.25px |

## Support

Support text is for small, subtle messaging such as assistive/helper text, tooltips and error messages.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.support-01` | `typescale-01` | 12px / 0.75rem | Regular 400 | 16px / 1rem | 0.25px |

## Action

Use action styles for interactive/action text where the component documentation calls for them.

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.action-02` | `typescale-03` | 16px / 1rem | Regular 400 | 24px / 1.5rem | 0.16px |
| `.action-01` | `typescale-02` | 14px / 0.875rem | Regular 400 | 20px / 1.25rem | 0.25px |

## Form text

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.input-text-02` | `typescale-03` | 16px / 1rem | Regular 400 | 28px / 1.75rem | 0.16px |
| `.input-text-01` | `typescale-03` | 16px / 1rem | Regular 400 | 24px / 1.5rem | 0.16px |
| `.placeholder-02` | `typescale-03` | 16px / 1rem | Light 300 | 28px / 1.75rem | 0.16px |
| `.placeholder-01` | `typescale-03` | 16px / 1rem | Light 300 | 24px / 1.5rem | 0.16px |

## Label

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.label-03` | `typescale-04` | 20px / 1.25rem | Medium 500 | 28px / 1.75rem | 0.16px |
| `.label-02` | `typescale-03` | 16px / 1rem | Medium 500 | 24px / 1.5rem | 0.25px |
| `.label-01` | `typescale-02` | 14px / 0.875rem | Medium 500 | 20px / 1.25rem | 0.25px |

## Key-value

Use key/value pairs where a label and its data value need a strong, consistent relationship.

### Key

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.key-03` | `typescale-03` | 16px / 1rem | Light 300 | 24px / 1.5rem | 0.16px |
| `.key-02` | `typescale-02` | 14px / 0.875rem | Light 300 | 20px / 1.25rem | 0.16px |
| `.key-01` | `typescale-01` | 12px / 0.75rem | Light 300 | 16px / 1rem | 0.25px |

### Value

| Class | Type scale | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- |
| `.value-03` | `typescale-07` | 32px / 2rem | Medium 500 | 40px / 2.5rem | 0px |
| `.value-02` | `typescale-05` | 24px / 1.5rem | Medium 500 | 32px / 2rem | 0px |
| `.value-01` | `typescale-03` | 16px / 1rem | Medium 500 | 24px / 1.5rem | 0.16px |

## Implementation rules for agents

1. Select the type set by documented content role, not by whichever size looks closest.
2. Keep semantic HTML hierarchy independent from visual type-set class. For example, an `h2` may use a Buckholt headline class when that is the documented visual role.
3. Do not recreate these combinations with custom CSS when the documented class exists.
4. Do not substitute Bootstrap `.display-*`, `.fs-*` or heading helper classes for Buckholt type sets simply because those helpers exist in the runtime stylesheet.
5. If a requested typography role is not documented here, flag the gap rather than inventing a new Buckholt type set.
