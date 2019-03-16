// import colorMix from 'color-mix'
// import ColorScheme from 'color-scheme'
import Please from 'pleasejs'

export function scheme () {
  return Please.make_scheme(
    {
      h: 130,
      s: .7,
      v: .75
    },
    {
      scheme: 'tri',
      format: 'rgb'
    });
}
