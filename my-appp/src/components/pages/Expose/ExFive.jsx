import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import './style.css';
import entreguesCell from '../../../assets/imgs/cell_entregues.png';

const features = [
  {
    name: 'Com poucos cliques. ',
    description:
      'Projetada para a praticidade no dia a dia, a página de pedidos da produção é incrivelmente fácil de usar.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Acompanhe e gerencie os pedidos.',
    description: ' Novos pedidos surgem instantaneamente, e a atualização do status é feita com um simples toque nos botões para manter todos informados sobre o progresso de cada item, ajudando a identificar e resolver gargalos rapidamente.',
    icon: ServerIcon,
  },
     {
    name: 'Relatórios.',
    description: 'Gere relatórios diários e semanais precisos para acompanhamento das suas vendas.',
    icon: ServerIcon,
  },
  {
    name: 'Segurança.',
    description: 'Além de várias camadas de segurança, seus pedidos ficam seguros na nuvem, impossibilitando percas de pedidos.',
    icon: LockClosedIcon
  }
]

export default function Example() {
  return (
    <div className="overflow-hidden py-24 sm:py-32 background-image">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-screen-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600">Deploy faster</h2>
              <p className="mt-2 py-3 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Melhor fluxo de trabalho
              </p>
              <p className="mt-6 text-lg/8 text-gray-600">
                 Deixe para trás os métodos manuais e ineficientes. Nossa plataforma intuitiva e visual transforma a maneira como seus pedidos são gerenciados, oferecendo agilidade e controle em tempo real.
                 Descubra o poder da tecnologia para otimizar seu negócio e se destacar da concorrência.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon aria-hidden="true" className="absolute left-1 top-1 size-5 text-indigo-600" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="Product screenshot"
            src={entreguesCell}
            width={2432}
            height={1442}
            className=""
          />
        </div>
      </div>
    </div>
  )
}
