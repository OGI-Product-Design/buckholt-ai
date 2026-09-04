# Buckholt global colour palette

The Global palette is the raw source layer for Buckholt colour. Components should normally consume semantic/foundation variables instead of selecting these values directly.

Values below are verified against `../../css/buckholt.css`.

## Base

| Variable | Value |
| --- | --- |
| `--white` | `#ffffff` |
| `--black` | `#1a1a1a` |
| `--transparent` | `transparent` |

## Neutral

| Step | Value |
| --- | --- |
| `--neutral-10` | `#fbfbfb` |
| `--neutral-20` | `#f7f7f7` |
| `--neutral-30` | `#efefef` |
| `--neutral-40` | `#dadada` |
| `--neutral-50` | `#bababa` |
| `--neutral-60` | `#919191` |
| `--neutral-70` | `#707070` |
| `--neutral-80` | `#595959` |
| `--neutral-90` | `#454545` |
| `--neutral-100` | `#2c2c2c` |

## Primary

| Step | Value |
| --- | --- |
| `--primary-10` | `#e7ecf9` |
| `--primary-20` | `#b7c6ee` |
| `--primary-30` | `#87a0e2` |
| `--primary-40` | `#5f81dd` |
| `--primary-50` | `#3f66d1` |
| `--primary-60` | `#1748d0` |
| `--primary-70` | `#0f40c5` |
| `--primary-80` | `#0c339e` |
| `--primary-90` | `#092676` |
| `--primary-100` | `#04133b` |

## Accent 01

| Step | Value |
| --- | --- |
| `--accent-01-10` | `#EEEAFB` |
| `--accent-01-20` | `#CDC1F1` |
| `--accent-01-30` | `#AB98EA` |
| `--accent-01-40` | `#8F71F0` |
| `--accent-01-50` | `#6846D9` |
| `--accent-01-60` | `#5731D6` |
| `--accent-01-70` | `#4E2CBE` |
| `--accent-01-80` | `#3D2295` |
| `--accent-01-90` | `#2C196B` |
| `--accent-01-100` | `#1B0F41` |

## Accent 02

| Step | Value |
| --- | --- |
| `--accent-02-10` | `#FBE8EE` |
| `--accent-02-20` | `#F3B8CC` |
| `--accent-02-30` | `#ED89AB` |
| `--accent-02-40` | `#E97099` |
| `--accent-02-50` | `#E84A7F` |
| `--accent-02-60` | `#DB1256` |
| `--accent-02-70` | `#AF0E44` |
| `--accent-02-80` | `#830A33` |
| `--accent-02-90` | `#570722` |
| `--accent-02-100` | `#2C0311` |

## Accent 03

| Step | Value |
| --- | --- |
| `--accent-03-10` | `#E7F2F6` |
| `--accent-03-20` | `#B7D9E3` |
| `--accent-03-30` | `#87C0D1` |
| `--accent-03-40` | `#56A6BF` |
| `--accent-03-50` | `#2490AE` |
| `--accent-03-60` | `#0E80A4` |
| `--accent-03-70` | `#0B6683` |
| `--accent-03-80` | `#094D62` |
| `--accent-03-90` | `#053342` |
| `--accent-03-100` | `#031A20` |

## Danger

| Step | Value |
| --- | --- |
| `--danger-10` | `#fbe7e8` |
| `--danger-20` | `#f4b6b7` |
| `--danger-30` | `#f09f9e` |
| `--danger-40` | `#e86e6d` |
| `--danger-50` | `#ee4949` |
| `--danger-60` | `#d7050c` |
| `--danger-70` | `#ae0a09` |
| `--danger-80` | `#820807` |
| `--danger-90` | `#590407` |
| `--danger-100` | `#2a0202` |

## Caution

| Step | Value |
| --- | --- |
| `--caution-10` | `#fff3e7` |
| `--caution-20` | `#ffd7b3` |
| `--caution-30` | `#ffbd80` |
| `--caution-40` | `#fea24d` |
| `--caution-50` | `#ff9533` |
| `--caution-60` | `#ff7a00` |
| `--caution-70` | `#e66e00` |
| `--caution-80` | `#b35400` |
| `--caution-90` | `#7f3d00` |
| `--caution-100` | `#4c2400` |

## Valid

| Step | Value |
| --- | --- |
| `--valid-10` | `#e7f3e7` |
| `--valid-20` | `#b9ddb9` |
| `--valid-30` | `#8ac48a` |
| `--valid-40` | `#5dac5b` |
| `--valid-50` | `#46a144` |
| `--valid-60` | `#168914` |
| `--valid-70` | `#136e11` |
| `--valid-80` | `#0c520c` |
| `--valid-90` | `#093708` |
| `--valid-100` | `#041b04` |

## Information

| Step | Value |
| --- | --- |
| `--info-10` | `#e7ecf9` |
| `--info-20` | `#b7c6ee` |
| `--info-30` | `#87a0e2` |
| `--info-40` | `#5f81dd` |
| `--info-50` | `#3f66d1` |
| `--info-60` | `#1748d0` |
| `--info-70` | `#0f40c5` |
| `--info-80` | `#0c339e` |
| `--info-90` | `#092676` |
| `--info-100` | `#04133b` |

## Tints and overlays

The runtime also defines black/white tints and tint families for primary, danger, caution, valid, info and all three accents. These are implementation primitives. Prefer semantic roles such as `--action-04`, `--ui-overlay-03` or a feedback token when one exists rather than selecting a tint directly.
