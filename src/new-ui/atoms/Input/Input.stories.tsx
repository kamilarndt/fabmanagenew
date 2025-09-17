import type { Meta, StoryObj } from '@storybook/react'
import { Eye, EyeOff, Lock, Mail, Search } from 'lucide-react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile input component with support for various states, sizes, and icons.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'success', 'warning'],
      description: 'The visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'The size of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'The type of input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Label for the input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Input>

// Basic Input
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

// Input with Label
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
  },
}

// Required Input
export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    required: true,
  },
}

// Input with Error
export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    error: 'Please enter a valid email address',
    defaultValue: 'invalid-email',
  },
}

// Input with Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    helperText: 'Choose a unique username',
  },
}

// Input with Icon (Left)
export const WithIconLeft: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
    icon: <Search className="h-4 w-4" />,
    iconPosition: 'left',
  },
}

// Input with Icon (Right)
export const WithIconRight: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    type: 'email',
    icon: <Mail className="h-4 w-4" />,
    iconPosition: 'right',
  },
}

// Password Input with Toggle
export const PasswordWithToggle: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    icon: <Lock className="h-4 w-4" />,
    iconPosition: 'left',
  },
  render: (args) => {
    const [showPassword, setShowPassword] = React.useState(false)
    
    return (
      <Input
        {...args}
        type={showPassword ? 'text' : 'password'}
        icon={
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        }
      />
    )
  },
}

// Different Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
    label: 'Small Input',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
    label: 'Large Input',
  },
}

// Different Variants
export const Success: Story = {
  args: {
    variant: 'success',
    placeholder: 'Success input',
    label: 'Success Input',
    defaultValue: 'Valid input',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    placeholder: 'Warning input',
    label: 'Warning Input',
    defaultValue: 'Warning input',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    placeholder: 'Destructive input',
    label: 'Destructive Input',
    error: 'This field has an error',
    defaultValue: 'Invalid input',
  },
}

// Disabled Input
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    defaultValue: 'Disabled value',
  },
}

// Different Input Types
export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    icon: <Mail className="h-4 w-4" />,
    iconPosition: 'left',
  },
}

export const Number: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: 'Enter quantity',
    helperText: 'Enter a number between 1 and 100',
  },
}

export const Tel: Story = {
  args: {
    label: 'Phone Number',
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
    helperText: 'Include country code',
  },
}

export const Url: Story = {
  args: {
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    helperText: 'Include https://',
  },
}

// Form Example
export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-96">
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        required
      />
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        icon={<Mail className="h-4 w-4" />}
        iconPosition="left"
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={<Lock className="h-4 w-4" />}
        iconPosition="left"
        required
        helperText="Must be at least 8 characters"
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 123-4567"
        helperText="Optional"
      />
    </form>
  ),
}