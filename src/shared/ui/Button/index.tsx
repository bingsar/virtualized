import type {
  ReactNode,
  MouseEventHandler,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

type ButtonSize = 'md' | 'sm'

type BaseProps = {
  size?: ButtonSize
  block?: boolean
  className?: string
  children: ReactNode
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
}

type AsButton = BaseProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'onClick' | 'children' | 'type' | 'disabled'
  > & {
    to?: never
    href?: never
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  }

type AsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'onClick' | 'children' | 'href'> & {
    href: string
    to?: never
  }

type AsLink = BaseProps & {
  to: string
  href?: never
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>['rel']
}

type Props = AsButton | AsAnchor | AsLink

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ')
}

function isButtonProps(p: Props): p is AsButton {
  return !('to' in p) && !('href' in p)
}

export function Button(props: Props) {
  const { size = 'md', block, className, children, disabled, ...restProps } = props

  const classes = cx(
    'btn',
    size === 'sm' && 'btn__sm',
    block && 'btn__block',
    disabled && 'is-disabled',
    className,
  )

  if ('to' in props && props.to) {
    const { to, target, rel, onClick } = props
    return (
      <Link
        to={to}
        target={target}
        rel={rel}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={classes}
      >
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, target, rel, onClick } = props
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={classes}
        aria-disabled={disabled ? true : undefined}
      >
        {children}
      </a>
    )
  }

  if (isButtonProps(props)) {
    const { onClick, type: buttonType = 'button', ...rest } = restProps as AsButton
    return (
      <button
        type={buttonType}
        onClick={onClick as MouseEventHandler<HTMLButtonElement>}
        className={classes}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    )
  }

  return null
}
