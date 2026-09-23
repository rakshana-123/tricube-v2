-- AlterTable
ALTER TABLE `materialorder` MODIFY `status` ENUM('created', 'paid', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'created';

-- AlterTable
ALTER TABLE `order` MODIFY `status` ENUM('created', 'paid', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'created';

-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('created', 'paid', 'failed', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'paid';
