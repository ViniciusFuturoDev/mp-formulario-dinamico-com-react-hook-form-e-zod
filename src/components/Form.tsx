import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormErros } from './FormErros';
import axios from 'axios';
import { useState } from 'react';
import { EyeOffIcon } from 'lucide-react';
import InputMask from 'react-input-mask';

const schema = z
  .object({
    name: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .min(2, 'O nome deve ter pelo menos 2 caracteres.')
      .max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
    email: z.string({ required_error: 'Este campo é obrigatório.' }).email().max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
    password: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
    password_confirmation: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
    terms: z.boolean({ invalid_type_error: 'Aceite os termos antes de continuar.' }),
    phone: z.string({ required_error: 'Este campo é obrigatório.' }).max(20, 'O telefone deve ter pelo menos 8 caracteres.'),
    cpf: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .max(14)
      .regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'O CPF deve estar no formato 000.000.000-00'),
    zipcode: z
      .string({ required_error: 'Este campo é obrigatório.' })
      .max(9)
      .regex(/^\d{5}[-]\d{3}$/gm, 'O CEP deve estar no formato 00000-000'),
    address: z.string({ required_error: 'Este campo é obrigatório.' }).max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
    city: z.string({ required_error: 'Este campo é obrigatório.' }).max(255, 'O nome deve ter pelo máximo 8 caracteres.'),
  })
  .refine(data => data.password === data.password_confirmation, {
    message: 'As senhas precisam ser iguais',
    path: ['password_confirmation'],
  });

type Schema = z.infer<typeof schema>;

export default function Form() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const FormSubmit = async (data: Schema) => {
    await axios.post('https://apis.codante.io/api/register-user/register', data);
    reset();
    setValue('phone', '');
    setValue('cpf', '');
    setValue('zipcode', '');
  };

  const getHouse = async () => {
    const house = await axios.get(`https://viacep.com.br/ws/${getValues('zipcode')}/json/`);
    setValue('address', house.data.logradouro);
    setValue('city', house.data.localidade);
  };

  return (
    <form onSubmit={handleSubmit(FormSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input type="text" id="name" {...register('name')} />
        {/* Sugestão de exibição de erro de validação */}
        {errors.name && <FormErros message={errors.name.message as string} />}
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input className="" type="email" id="email" {...register('email')} />
        {errors.email && <FormErros message={errors.email.message as string} />}
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input type={showPassword ? 'text' : 'password'} id="password" {...register('password')} />
          <span className="absolute right-3 top-3">
            {showPassword ? (
              <button>
                <EyeOffIcon className="text-slate-600 cursor-pointer" size={20} onClick={() => setShowPassword(false)} />
              </button>
            ) : (
              <button>
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" onClick={() => setShowPassword(true)} />
              </button>
            )}
          </span>
          {errors.password && <FormErros message={errors.password.message as string} />}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input type={showPasswordConfirmation ? 'text' : 'password'} id="confirm-password" {...register('password_confirmation')} />
          <span className="absolute right-3 top-3">
            {showPasswordConfirmation ? (
              <button>
                <EyeOffIcon className="text-slate-600 cursor-pointer" size={20} onClick={() => setShowPasswordConfirmation(false)} />
              </button>
            ) : (
              <button>
                <EyeIcon size={20} className="text-slate-600 cursor-pointer" onClick={() => setShowPasswordConfirmation(true)} />
              </button>
            )}
          </span>
          {errors.password_confirmation && <FormErros message={errors.password_confirmation.message as string} />}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <InputMask mask="(99) 99999-9999" type="text" id="phone" {...register('phone')} />
        {errors.phone && <FormErros message={errors.phone.message as string} />}
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <InputMask mask="999.999.999-99" type="text" id="cpf" {...register('cpf')} />
        {errors.cpf && <FormErros message={errors.cpf.message as string} />}
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <InputMask mask="99999-999" type="text" id="cep" {...register('zipcode')} onBlur={getHouse} />
        {errors.zipcode && <FormErros message={errors.zipcode.message as string} />}
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input className="disabled:bg-slate-200" type="text" id="address" {...register('address')} disabled />
        {errors.address && <FormErros message={errors.address.message as string} />}
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input className="disabled:bg-slate-200" type="text" id="city" {...register('city')} disabled />
        {errors.city && <FormErros message={errors.city.message as string} />}
      </div>
      {/* terms and conditions input */}
      <div className="mb-4">
        <input type="checkbox" id="terms" className="mr-2 accent-slate-500" {...register('terms')} />
        <label className="text-sm  font-light text-slate-500 mb-1 inline" htmlFor="terms">
          Aceito os <span className="underline hover:text-slate-900 cursor-pointer">termos e condições</span>
        </label>
        {errors.terms && <FormErros message={errors.terms.message as string} />}
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors"
      >
        Cadastrar
      </button>
    </form>
  );
}
