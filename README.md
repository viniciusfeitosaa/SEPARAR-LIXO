# 🌍 Jogo de descarte correto de Lixo

Um jogo educativo web para ensinar crianças sobre o descarte correto do lixo. Recriado a partir de um jogo original desenvolvido no Godot.

## 🎮 Como Jogar

1. **Objetivo**: Mover o lixo que está caindo para a lixeira correta
2. **Controles**:
   - **Desktop**: Use as setas do teclado (← →) para mover o lixo horizontalmente
   - **Mobile**: Use os botões na tela, deslize para a esquerda/direita, ou incline o celular
   - **Giroscópio**: Em celulares, incline o dispositivo para controlar o lixo
   - **Barreiras**: O lixo não pode sair das bordas da tela
3. **Pontuação**: +15 pontos quando o lixo atinge a lixeira correta
4. **Vidas**: Você tem 5 vidas (corações vermelhos). Perde uma vida quando o lixo atinge a lixeira errada (coração fica cinza). Jogo acaba quando todos os corações ficam cinzas.
5. **Níveis**: A cada 20 acertos, você sobe de nível (máximo nível 5). A velocidade aumenta a cada nível.

## 🗂️ Tipos de Lixo

### 📄 Papel (Azul)
- Jornais, revistas, caixas de papelão
- Papel e papelão recicláveis

### 🥤 Plástico (Vermelho)
- Garrafas PET, tampas, embalagens plásticas
- Plásticos recicláveis

### 🍾 Vidro (Verde)
- Garrafas, frascos, potes de vidro
- Vidros recicláveis

### 🥫 Metal (Amarelo)
- Latas de refrigerante, tampas de alumínio
- Metais recicláveis

### 🍎 Orgânico (Marrom)
- Restos de alimentos, cascas de frutas
- Materiais biodegradáveis

## 🎯 Características do Jogo

- ✅ **Totalmente Responsivo**: Se adapta perfeitamente a qualquer tamanho de tela
- ✅ **Educativo**: Ensina sobre descarte correto de lixo de forma divertida
- ✅ **Interativo**: Controles por mouse, teclado e giroscópio
- ✅ **Progressivo**: Sistema de níveis e pontuação
- ✅ **Visual Atraente**: Interface moderna com animações
- ✅ **Feedback Visual**: Mensagens de acerto/erro
- ✅ **Pausável**: Possibilidade de pausar o jogo
- ✅ **Controle por Giroscópio**: Incline o celular para controlar o lixo

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilos, animações e responsividade
- **JavaScript ES6+**: Lógica do jogo orientada a objetos
- **Emojis**: Para representar os diferentes tipos de lixo

## 🎨 Personalização

Você pode facilmente personalizar o jogo:

- **Adicionar novos tipos de lixo**: Edite o objeto `trashTypes` no arquivo `script.js`
- **Alterar cores**: Modifique as variáveis CSS no arquivo `styles.css`
- **Ajustar dificuldade**: Mude os valores de `fallSpeed` e intervalos no JavaScript
- **Adicionar sons**: Implemente efeitos sonoros usando a Web Audio API

## 📱 Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🎮 Controle por Giroscópio

### Como Ativar:
1. **Abra o jogo** em um dispositivo móvel
2. **Clique no botão** "🎮 Ativar Giroscópio" no canto superior direito
3. **Permita o acesso** quando solicitado
4. **Incline o celular** para controlar o lixo

### Como Usar:
- **Incline para a esquerda** → Move o lixo para a esquerda
- **Incline para a direita** → Move o lixo para a direita
- **Mantenha reto** → Lixo para de se mover
- **Sensibilidade ajustável** para controle preciso
- **Botão "⚙️ Velocidade"** → Alterna entre 3 velocidades (Lento, Normal, Rápido)

### Compatibilidade:
- ✅ **iOS 13+**: Requer permissão do usuário
- ✅ **Android**: Funciona automaticamente
- ✅ **Tablets**: Suporte completo
- ⚠️ **Desktop**: Não disponível (use teclado)

## 🤝 Contribuição

Sinta-se à vontade para contribuir com melhorias:
- Adicionar novos tipos de lixo
- Implementar sistema de sons
- Criar novos níveis de dificuldade
- Melhorar a acessibilidade
- Adicionar modo multiplayer

## 📄 Licença

Este projeto é de código aberto e pode ser usado livremente para fins educativos.

---

**Divirta-se jogando e aprendendo sobre reciclagem! 🌱♻️** 
